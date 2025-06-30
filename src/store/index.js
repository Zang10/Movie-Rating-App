import { createStore } from 'vuex'
import { movieService } from '@/services/movieService'

export default createStore({
  state: {
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    searchQuery: '',
    users: JSON.parse(localStorage.getItem('users')) || [], // registered users
    user: JSON.parse(localStorage.getItem('user')) || null, // current logged-in user
    ratings: JSON.parse(localStorage.getItem('ratings')) || {}, // { username: { movieId: rating } }
    humanVerified: false,
    loginRecords: JSON.parse(localStorage.getItem('loginRecords')) || []
  },
  mutations: {
    SET_MOVIES(state, movies) {
      state.movies = movies
    },
    SET_CURRENT_MOVIE(state, movie) {
      state.currentMovie = movie
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_TOTAL_PAGES(state, total) {
      state.totalPages = total
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    LOGOUT(state) {
      state.user = null
      localStorage.removeItem('user')
    },
    REGISTER_USER(state, newUser) {
      state.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(state.users))
    },
    SET_RATING(state, { username, movieId, rating }) {
      if (!state.ratings[username]) {
        state.ratings[username] = {}
      }
      state.ratings[username][movieId] = rating
      localStorage.setItem('ratings', JSON.stringify(state.ratings))
    },
    SET_HUMAN_VERIFIED(state, val) {
      state.humanVerified = val
    },
    ADD_LOGIN_RECORD(state, record) {
      state.loginRecords.push(record)
      localStorage.setItem('loginRecords', JSON.stringify(state.loginRecords))
    }
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
        const movie = await movieService.getMovieDetails(movieId)
        commit('SET_CURRENT_MOVIE', movie)
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

    register({ commit, state }, { username, password }) {
      /* eslint-disable-next-line no-useless-escape */
      const usernamePattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{3,}$/
      if(!usernamePattern.test(username)){
        throw new Error('Username must contain at least one capital letter and one special symbol (e.g. @ # !)')
      }
      // Check if username already exists
      if (state.users.find(u => u.username === username)) {
        throw new Error('Username already exists')
      }
      // Password strength: min 6 chars, at least upper, lower, digit, special
      const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/
      if(!pwdPattern.test(password)){
        throw new Error('Password must be at least 6 characters and include uppercase, lowercase, number and symbol')
      }
      const newUser = { username, password }
      commit('REGISTER_USER', newUser)
      commit('SET_USER', newUser)
      commit('SET_HUMAN_VERIFIED', false)
    },

    login({ commit, state }, { username, password }) {
      const user = state.users.find(u => u.username === username && u.password === password)
      if (!user) {
        throw new Error('Invalid username or password')
      }
      commit('SET_USER', user)
      commit('ADD_LOGIN_RECORD', { username, timestamp: Date.now() })
      commit('SET_HUMAN_VERIFIED', false)
    },

    logout({ commit }) {
      commit('LOGOUT')
      commit('SET_HUMAN_VERIFIED', false)
    },

    setRating({ commit, state }, { movieId, rating }) {
      if (!state.user) throw new Error('You must be logged in to rate movies.')
      commit('SET_RATING', { username: state.user.username, movieId, rating })
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
    getUserRating: state => movieId => {
      if (!state.user) return null
      return state.ratings[state.user.username]?.[movieId] || null
    },
    loginRecords: state => state.loginRecords
  }
}) 