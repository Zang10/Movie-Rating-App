import axios from 'axios'

// TMDB API configuration
const API_KEY = 'f46d8b86f0e5bb8364c1a2ac7aab26be'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const MAX_RETRIES = 3
const RETRY_DELAY = 2000
const TIMEOUT = 20000

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US'
  },
  timeout: TIMEOUT
})

// Request interceptor
api.interceptors.request.use(
  config => {
    // Log the full URL being requested
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`Making request to: ${fullUrl}`)
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject({
      message: 'Failed to make request. Please check your internet connection.',
      originalError: error
    })
  }
)

// Response interceptor with enhanced retry logic
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Log the full error details
    console.error('API Error:', {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    })

    // Handle network errors
    if (!error.response) {
      if (originalRequest._retryCount < MAX_RETRIES) {
        originalRequest._retryCount = originalRequest._retryCount || 0
        originalRequest._retryCount++

        console.log(`Retrying request (${originalRequest._retryCount}/${MAX_RETRIES})...`)
        
        // Exponential backoff
        const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return api(originalRequest)
      }

      return Promise.reject({
        message: 'Unable to connect to the movie database. Please check your internet connection and try again.',
        originalError: error
      })
    }

    // Handle specific HTTP errors
    switch (error.response.status) {
      case 401:
        return Promise.reject({
          message: 'Authentication failed. Please check your API key.',
          originalError: error
        })
      case 404:
        return Promise.reject({
          message: 'The requested movie could not be found.',
          originalError: error
        })
      case 429:
        return Promise.reject({
          message: 'Too many requests. Please try again later.',
          originalError: error
        })
      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject({
          message: 'The movie database is currently unavailable. Please try again later.',
          originalError: error
        })
      default:
        return Promise.reject({
          message: 'An unexpected error occurred. Please try again.',
          originalError: error
        })
    }
  }
)

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get('/movie/popular', {
      params: { page }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

export const getMovieDetails = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    throw error
  }
}

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page }
    })
    return response.data
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}

export const discoverMovies = async (options = {}, page = 1) => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        page,
        ...options
      }
    })
    return response.data
  } catch (error) {
    console.error('Error discovering movies:', error)
    throw error
  }
}

// Export the image base URL for use in components
export const getImageUrl = (path) => {
  if (!path) return null
  return `${IMAGE_BASE_URL}${path}`
} 