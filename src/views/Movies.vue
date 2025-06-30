<template>
  <div class="movies-container container-lg">
    <div class="search-container mb-4" v-if="false">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search movies..."
          :disabled="isLoading"
        >
        <button 
          class="rateflix-btn rateflix-btn-primary" 
          @click="handleSearch"
          :disabled="isLoading"
        >
          <i class="bi" :class="isLoading ? 'bi-hourglass-split' : 'bi-search'"></i>
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
        <button
          class="rateflix-btn rateflix-btn-outline-secondary"
          @click="resetSearch"
          :disabled="isLoading || !searchQuery"
        >
          <i class="bi bi-x-circle"></i>
          Clear
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="hasError" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ errorMessage }}
      <button type="button" class="rateflix-btn-close" @click="clearError"></button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading movies...</p>
    </div>

    <!-- No Results -->
    <div v-else-if="!isLoading && movies.length === 0" class="text-center my-5">
      <i class="bi bi-film display-1 text-muted"></i>
      <h3 class="mt-3">No movies found</h3>
      <p class="text-muted">
        {{ searchQuery ? 'Try a different search term' : 'Unable to load movies. Please try again.' }}
      </p>
      <button 
        v-if="hasError" 
        class="rateflix-btn rateflix-btn-primary mt-3"
        @click="retryLoading"
      >
        <i class="bi bi-arrow-clockwise me-2"></i>
        Retry
      </button>
    </div>

    <!-- Movie Grid -->
    <div v-else class="movie-grid">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @select="viewMovieDetails(movie.id)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && movies.length > 0" class="d-flex justify-content-center mt-4">
      <nav aria-label="Movie pagination">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button 
              class="page-link" 
              @click="changePage(1)"
              :disabled="currentPage === 1 || isLoading"
            >
              First
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button 
              class="page-link" 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1 || isLoading"
            >
              Previous
            </button>
          </li>
          <li class="page-item" :class="{ active: currentPage === page }" v-for="page in visiblePages" :key="page">
            <button 
              class="page-link" 
              @click="changePage(page)"
              :disabled="isLoading"
            >
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button 
              class="page-link" 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages || isLoading"
            >
              Next
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button 
              class="page-link" 
              @click="changePage(totalPages)"
              :disabled="currentPage === totalPages || isLoading"
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MovieCard from '@/components/MovieCard.vue'
import { movieService } from '@/services/movieService'

export default {
  name: 'Movies',
  components: { MovieCard },
  data() {
    return {
      searchQuery: '',
      searchTimeout: null
    }
  },
  computed: {
    ...mapState(['movies']),
    ...mapGetters([
      'isLoading',
      'hasError',
      'errorMessage',
      'currentPage',
      'totalPages'
    ]),
    visiblePages() {
      // Show up to 5 pages, centered on the current page
      const pages = [];
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, this.currentPage + 2);
      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(this.totalPages, start + 4);
        } else if (end === this.totalPages) {
          start = Math.max(1, end - 4);
        }
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  methods: {
    ...mapActions(['fetchMovies', 'searchMovies', 'changePage' /* alias fallback */]),
    async changePage(page) {
      if(page < 1 || page > this.totalPages) return
      // Update route with new page number to make navigation declarative
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          page
        }
      })
    },
    async loadByRoute() {
      const { q, genres, start, end, rating, lang, page } = this.$route.query

      const pageNum = Number(page) || 1
      if(this.currentPage !== pageNum){
        this.$store.commit('SET_CURRENT_PAGE', pageNum)
      }
      
      if (q) {
        // if there's a search query, use existing search flow
        this.searchQuery = q
        await this.searchMovies(q)
        return
      }

      // Build discover options if any filter param exists
      const hasFilters = genres || start || end || rating || lang
      if (hasFilters) {
        this.$store.commit('SET_LOADING', true)
        this.$store.commit('SET_ERROR', null)

        const options = {}
        if (genres) {
          // genres can be array or string
          const genreVal = Array.isArray(genres) ? genres.join(',') : genres
          options.with_genres = genreVal
        }
        if (start) {
          options['primary_release_date.gte'] = `${start}-01-01`
        }
        if (end) {
          options['primary_release_date.lte'] = `${end}-12-31`
        }
        if (rating) {
          options['vote_average.gte'] = rating
        }
        if (lang) {
          options.with_original_language = lang
        }

        try {
          const data = await movieService.discoverMovies(options, this.currentPage)
          this.$store.commit('SET_MOVIES', data.results)
          this.$store.commit('SET_TOTAL_PAGES', Math.min(data.total_pages, 500))
        } catch (err) {
          console.error(err)
          this.$store.commit('SET_ERROR', err.message || 'Failed to load filtered movies')
          this.$store.commit('SET_MOVIES', [])
        } finally {
          this.$store.commit('SET_LOADING', false)
        }
      } else {
        // default popular list
        await this.fetchMovies()
      }
    },
    resetSearch() {
      this.searchQuery = ''
      this.$store.dispatch('clearSearch')
    },
    handleSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.searchMovies(this.searchQuery)
      }, 500)
    },
    viewMovieDetails(movieId) {
      this.$router.push(`/movie/${movieId}`)
    },
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
    },
    clearError() {
      this.$store.commit('SET_ERROR', null)
    },
    retryLoading() {
      this.clearError()
      this.fetchMovies()
    }
  },
  created() {
    this.loadByRoute()
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadByRoute()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.movies-container {
  padding: 20px;
  background: #0f1626;
  min-height: 100vh;
}

.movies-container.container-lg {
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-control {
  border: 1px solid #E5E5EA;
  border-radius: 0.8rem;
  padding: 0.75rem 1rem;
  background: #FFFFFF;
  color: #1C1C1E;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: #6E6E73;
  box-shadow: 0 0 0 2px rgba(110, 110, 115, 0.1);
}

.btn-primary {
  background: #1f2937;
  color: #f3f4f6;
  border: 1px solid #374151;
  border-radius: 0.8rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #374151;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #6E6E73;
  opacity: 0.7;
}

.btn-outline-secondary {
  background: #1f2937;
  border: 1px solid #374151;
  color: #f3f4f6;
  border-radius: 0.8rem;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover:not(:disabled) {
  background: #374151;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.card-img-top {
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.card-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #b0b0b6;
  font-size: 0.95rem;
}

.pagination {
  gap: 0.25rem;
}

.page-link {
  border: 1px solid rgba(255,255,255,0.15);
  color: #ffffff;
  background: rgba(255,255,255,0.05);
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  transition: all 0.2s ease;
}

.page-link:hover:not(:disabled) {
  background: rgba(255,255,255,0.12);
  color: #ffffff;
  border-color: rgba(255,255,255,0.15);
}

.page-item.active .page-link {
  background: #e50914;
  border-color: #e50914;
  color: #FFFFFF;
}

.page-item.disabled .page-link {
  background: rgba(255,255,255,0.05);
  color: #ffffff;
  border-color: rgba(255,255,255,0.15);
  opacity: 1;
}

/* Ensure Bootstrap disabled buttons don't dim text */
.page-link[disabled] {
  opacity: 1 !important;
  color: #ffffff !important;
}

.alert {
  background: #F2F2F7;
  border: 1px solid #E5E5EA;
  border-radius: 0.8rem;
  color: #1C1C1E;
}

.alert-danger {
  background: #FEF2F2;
  border-color: #FEE2E2;
  color: #991B1B;
}

.spinner-border {
  color: #1C1C1E;
}

.text-muted {
  color: #6E6E73 !important;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.search-container .form-control {
  background: #1f2937;
  border: 1px solid #374151;
  color: #f3f4f6;
}
.search-container .form-control::placeholder {
  color: #9ca3af;
}
</style> 