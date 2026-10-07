import { getPopularMovies, getMovieDetails, searchMovies, discoverMovies as apiDiscover } from '../api/tmdb'

export const movieService = {
  async getMovies(page = 1) {
    try {
      const response = await getPopularMovies(page)
      return response
    } catch (error) {
      console.error('Error in movieService.getMovies:', error)
      throw error
    }
  },

  async getMovieDetails(movieId) {
    try {
      const response = await getMovieDetails(movieId)
      return response
    } catch (error) {
      console.error('Error in movieService.getMovieDetails:', error)
      throw error
    }
  },

  async searchMovies(query, page = 1) {
    try {
      const response = await searchMovies(query, page)
      return response
    } catch (error) {
      console.error('Error in movieService.searchMovies:', error)
      throw error
    }
  },

  async discoverMovies(options = {}, page = 1) {
    try {
      const response = await apiDiscover(options, page)
      return response
    } catch (error) {
      console.error('Error in movieService.discoverMovies:', error)
      throw error
    }
  }
} 