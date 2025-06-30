<template>
  <div class="home dark">
    <!-- Hero Carousel Section -->
    <div class="hero-container container-lg px-0">
      <HeroCarousel :slides="carouselSlides" />
    </div>

    <div class="featured-movies mt-5 container-lg">
      <h2 class="section-title mb-4">Featured Movies</h2>
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <div v-for="movie in featuredMovies" :key="movie.id" class="col">
          <div class="card h-100 clickable-card" @click="viewMovie(movie.id)">
            <img
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-image.png'"
              class="card-img-top"
              :alt="movie.title"
              @error="$event.target.src='/no-image.png'"
            >
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <p class="card-text">
                <small class="text-muted">Release Date: {{ formatDate(movie.release_date) }}</small>
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge">{{ movie.vote_average.toFixed(1) }}/10</span>
                <router-link
                  :to="`/movie/${movie.id}`"
                  class="rateflix-btn rateflix-btn-accent rateflix-btn-sm"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Browse all movies button -->
      <div class="text-center mt-4">
        <router-link to="/movies" class="rateflix-btn rateflix-btn-accent rateflix-btn-lg">Browse All Movies</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import HeroCarousel from '@/components/HeroCarousel.vue'

export default {
  name: 'Home',
  components: { HeroCarousel },
  setup() {
    const store = useStore()
    const router = useRouter()
    const searchInput = ref('')
    const featuredMovies = computed(() => store.state.movies.filter(m => m.poster_path).slice(0, 3))
    const carouselSlides = computed(() => store.state.movies.filter(m => m.backdrop_path).slice(0, 5))

    const heroImageSrc = computed(() => {
      const first = store.state.movies[0]
      return first && first.backdrop_path ? `https://image.tmdb.org/t/p/original${first.backdrop_path}` : 'https://via.placeholder.com/640x360?text=Movies'
    })

    const topSearches = [
      'Oppenheimer', 'John Wick', 'Interstellar', 'The Dark Knight', 'Dune'
    ]

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const triggerSearch = () => {
      if (!searchInput.value) return
      store.dispatch('searchMovies', searchInput.value)
      router.push('/movies')
    }

    const quickSearch = (query) => {
      searchInput.value = query
      triggerSearch()
    }

    const viewMovie = (id) => {
      router.push(`/movie/${id}`)
    }

    onMounted(async () => {
      // If the user previously searched for a movie, clear that search so the
      // homepage always shows the default popular titles.
      if (store.state.searchQuery) {
        await store.dispatch('clearSearch')
      } else if (store.state.movies.length === 0) {
        await store.dispatch('fetchMovies')
      }
    })

    return {
      featuredMovies,
      carouselSlides,
      heroImageSrc,
      searchInput,
      triggerSearch,
      quickSearch,
      topSearches,
      formatDate,
      viewMovie
    }
  }
}
</script>

<style scoped>
.home.dark {
  background: #0f1626; /* rich navy */
  color: #ffffff;
  min-height: 100vh;
}

/* Hero */
.hero-wrapper {
  background: #1b2336; /* slightly lighter navy */
  border: 1px solid rgba(255,255,255,0.05);
}

.hero-logo {
  width: 220px;
}

.search-box .form-control {
  border-radius: 0.8rem 0 0 0.8rem;
  background: #0f1626;
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
}

.search-box .rateflix-btn.rateflix-btn-accent {
  border-radius: 0 0.8rem 0.8rem 0;
  background: #e50914;
  border: none;
  color: #fff;
}

.rateflix-btn-accent {
  background: #e50914;
  border: none;
  color: #fff;
}

.rateflix-btn-accent:hover {
  background: #f6121d;
  color: #fff;
}

.top-search-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.top-search-item {
  color: #bbbbbb;
  text-decoration: none;
  font-size: 0.9rem;
}

.top-search-item:hover {
  color: #ffffff;
}

.rateflix-watch-btn {
  background: #e50914;
  border: none;
  color: #fff !important;
  font-weight: 500;
}

.hero-image img {
  width: 320px;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

.section-title {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
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

.badge {
  background: #0A84FF;
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
}

.rateflix-btn-outline-primary {
  color: #1C1C1E;
  border: 1px solid #E5E5EA;
  border-radius: 0.6rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.rateflix-btn-outline-primary:hover {
  background: #F2F2F7;
  border-color: #E5E5EA;
  color: #1C1C1E;
}

.card-img-top {
  height: 400px;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.text-muted {
  color: #6E6E73 !important;
}

@media (max-width: 768px) {
  .card-img-top {
    height: 300px;
  }
}

/* Add after existing home.dark style */
.hero-container {
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.featured-movies.container-lg {
  max-width: 1320px;
}

.clickable-card {
  cursor: pointer;
}
</style> 