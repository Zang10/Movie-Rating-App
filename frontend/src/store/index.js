import { createStore } from 'vuex'
import { movieService } from '@/services/movieService'
import backend from '@/api/backend'

export default createStore({
  state: {
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    searchQuery: '',
    user: null,
    ratings: {},
    ratingSummaries: {},
    humanVerified: false
  },
  mutations: {
    SET_MOVIES(state, movies) { state.movies = movies },
    SET_CURRENT_MOVIE(state, movie) { state.currentMovie = movie },
    SET_LOADING(state, loading) { state.loading = loading },
    SET_ERROR(state, error) { state.error = error },
    SET_TOTAL_PAGES(state, pages) { state.totalPages = pages },
    SET_CURRENT_PAGE(state, page) { state.currentPage = page },
    SET_SEARCH_QUERY(state, query) { state.searchQuery = query },
    SET_USER(state, user) { state.user = user },
    LOGOUT(state) { state.user = null; state.ratings = {} },
    SET_RATING(state, { movieId, rating }) {
      if (rating === null) delete state.ratings[movieId]
      else state.ratings[movieId] = rating
    },
    SET_RATING_SUMMARY(state, { movieId, averageRating, ratingCount }) {
      state.ratingSummaries = {
        ...state.ratingSummaries,
        [movieId]: {
          averageRating: averageRating ?? null,
          ratingCount: Number(ratingCount) || 0
        }
      }
    },
    SET_HUMAN_VERIFIED(state, value) { state.humanVerified = value }
  },
  actions: {
    async fetchMovies({ commit, state }) {
      if (state.loading) return
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const data = state.searchQuery
          ? await movieService.searchMovies(state.searchQuery, state.currentPage)
          : await movieService.getMovies(state.currentPage)
        commit('SET_MOVIES', data.results)
        commit('SET_TOTAL_PAGES', Math.min(data.total_pages, 500))
      } catch (error) {
        console.error('Error in fetchMovies:', error)
        commit('SET_ERROR', error.message || 'Failed to fetch movies')
        commit('SET_MOVIES', [])
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchMovieDetails({ commit }, movieId) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        commit('SET_CURRENT_MOVIE', await movieService.getMovieDetails(movieId))
      } catch (error) {
        console.error('Error in fetchMovieDetails:', error)
        commit('SET_ERROR', error.message || 'Failed to fetch movie details')
        commit('SET_CURRENT_MOVIE', null)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async searchMovies({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1)
      await dispatch('fetchMovies')
    },
    async clearSearch({ commit, dispatch }) {
      commit('SET_SEARCH_QUERY', '')
      commit('SET_CURRENT_PAGE', 1)
      await dispatch('fetchMovies')
    },
    async changePage({ commit, dispatch }, page) {
      commit('SET_CURRENT_PAGE', page)
      await dispatch('fetchMovies')
    },
    async register({ commit }, credentials) {
      const { data } = await backend.post('/auth/register', credentials)
      commit('SET_USER', data.user)
      commit('SET_HUMAN_VERIFIED', false)
    },
    async login({ commit }, credentials) {
      const { data } = await backend.post('/auth/login', credentials)
      commit('SET_USER', data.user)
      commit('SET_HUMAN_VERIFIED', false)
    },
    async restoreSession({ commit }) {
      try {
        const { data } = await backend.get('/auth/me')
        commit('SET_USER', data.user)
      } catch {
        commit('SET_USER', null)
      }
    },
    async logout({ commit }) {
      try {
        await backend.post('/auth/logout')
      } finally {
        commit('LOGOUT')
        commit('SET_HUMAN_VERIFIED', false)
      }
    },
    async fetchRatingSummary({ commit }, movieId) {
      try {
        const { data } = await backend.get(`/ratings/${encodeURIComponent(movieId)}`)
        commit('SET_RATING', { movieId, rating: data.rating ?? data.userRating ?? null })
        commit('SET_RATING_SUMMARY', {
          movieId,
          averageRating: data.averageRating ?? null,
          ratingCount: data.ratingCount ?? 0
        })
        return data
      } catch (error) {
        console.error('Error in fetchRatingSummary:', error)
        return null
      }
    },
    async fetchUserRating({ dispatch }, movieId) {
      return dispatch('fetchRatingSummary', movieId)
    },
    async setRating({ commit, state }, { movieId, rating }) {
      if (!state.user) throw new Error('You must be logged in to rate movies.')
      const { data } = await backend.put(`/ratings/${encodeURIComponent(movieId)}`, { rating })
      commit('SET_RATING', { movieId, rating: data.rating ?? data.userRating ?? rating })
      commit('SET_RATING_SUMMARY', {
        movieId,
        averageRating: data.averageRating ?? null,
        ratingCount: data.ratingCount ?? 0
      })
      return data
    }
  },
  getters: {
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    errorMessage: state => state.error,
    currentMovie: state => state.currentMovie,
    totalPages: state => state.totalPages,
    currentPage: state => state.currentPage,
    searchQuery: state => state.searchQuery,
    user: state => state.user,
    isAuthenticated: state => !!state.user,
    getUserRating: state => movieId => state.ratings[movieId] || null,
    getRatingSummary: state => movieId => state.ratingSummaries[movieId] || { averageRating: null, ratingCount: 0 }
  }
})
