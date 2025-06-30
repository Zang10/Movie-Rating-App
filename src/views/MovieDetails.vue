<template>
  <div class="movie-details-container">
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center loading-container">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="movie" class="movie-details">
      <!-- Hero Section -->
      <div class="hero-section">
        <h1 class="glow-text">{{ movie.title }}</h1>
        <p class="subtitle-text">{{ movie.tagline }}</p>
      </div>

      <div class="content-section">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="poster-container">
              <img 
                :src="getImageUrl(movie.poster_path)" 
                :alt="movie.title"
                class="movie-poster"
              >
            </div>
          </div>
          <div class="col-md-8">
            <!-- User Rating Section -->
            <div class="rating-section glass-card mb-4">
              <div v-if="isAuthenticated">
                <h5 class="section-title"><i class="bi bi-star me-2 text-warning"></i>Your Rating</h5>
                <div class="d-flex align-items-center gap-2">
                  <span v-for="star in 5" :key="star" @click="rateMovie(star)" class="star-rating">
                    <i v-if="hasBootstrapIcons" :class="userRating >= star ? 'bi bi-star-fill text-warning' : 'bi bi-star text-secondary'"></i>
                    <span v-else :style="userRating >= star ? 'color: #ffc107;' : 'color: #adb5bd;'">
                      {{ userRating >= star ? '★' : '☆' }}
                    </span>
                  </span>
                  <span v-if="userRating" class="ms-2 rating-value">({{ userRating }}/5)</span>
                  <span v-else class="ms-2 text-muted">Not rated yet</span>
                </div>
                <div v-if="ratingMessage" class="text-success mt-1">{{ ratingMessage }}</div>
              </div>
              <div v-else>
                <div class="login-alert">Please <router-link to="/login">log in</router-link> to rate this movie.</div>
              </div>
            </div>

            <!-- Movie Info Section -->
            <div class="movie-info mb-4">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="info-card glass-card">
                    <h5 class="section-title"><i class="bi bi-calendar-event me-2"></i>Release Date</h5>
                    <p class="mb-0">{{ formatDate(movie.release_date) }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-card glass-card">
                    <h5 class="section-title"><i class="bi bi-clock-history me-2"></i>Runtime</h5>
                    <p class="mb-0">{{ movie.runtime ? movie.runtime + ' min' : 'N/A' }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-card glass-card">
                    <h5 class="section-title"><i class="bi bi-star-fill me-2 text-warning"></i>Rating</h5>
                    <p class="mb-0">{{ movie.vote_average?.toFixed(1) }}/10 ({{ movie.vote_count }} votes)</p>
                  </div>
                </div>
                <div class="col-12">
                  <div class="info-card glass-card">
                    <h5 class="section-title"><i class="bi bi-tags me-2"></i>Genres</h5>
                    <div class="d-flex flex-wrap gap-2">
                      <span 
                        v-for="genre in movie.genres" 
                        :key="genre.id"
                        class="genre-badge"
                      >
                        {{ genre.name }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="info-card glass-card">
                    <h5 class="section-title"><i class="bi bi-file-text me-2"></i>Summary</h5>
                    <p class="mb-0">{{ movie.overview || 'No summary available.' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cast Section -->
            <div v-if="movie.credits?.cast?.length" class="cast-section glass-card mb-4">
              <h5 class="section-title"><i class="bi bi-people me-2"></i>Cast</h5>
              <div class="row row-cols-2 row-cols-md-4 g-3">
                <div v-for="actor in movie.credits.cast.slice(0, 8)" :key="actor.id" class="col text-center">
                  <img
                    :src="actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'"
                    :alt="actor.name"
                    class="cast-photo mb-2"
                  >
                  <p class="cast-name mb-0">{{ actor.name }}</p>
                </div>
              </div>
            </div>

            <!-- Trailer Section -->
            <div v-if="movie.videos?.results?.length" class="trailer-section glass-card mb-4">
              <h5 class="section-title"><i class="bi bi-play-circle me-2"></i>Trailer</h5>
              <div class="ratio ratio-16x9">
                <iframe 
                  :src="`https://www.youtube.com/embed/${movie.videos.results[0].key}`"
                  title="YouTube video"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended Movies Section -->
      <div v-if="movie.recommendations?.results?.length" class="similar-movies-section mt-5">
        <h3 class="section-title text-center mb-4">Recommended Movies</h3>
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div v-for="rec in movie.recommendations.results.slice(0, 4)" :key="rec.id" class="col">
            <div class="similar-movie-card glass-card h-100" @click="viewMovieDetails(rec.id)">
              <img 
                :src="rec.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${rec.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Image'"
                class="card-img-top" 
                :alt="rec.title"
              >
              <div class="card-body">
                <h5 class="card-title">{{ rec.title }}</h5>
                <p class="card-text">
                  <small class="text-muted">{{ rec.release_date?.split('-')[0] }}</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Component -->
    <HumanVerificationModal :open="showHuman" @verified="onVerified" @close="showHuman=false"/>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getImageUrl } from '@/api/tmdb'
import HumanVerificationModal from '@/components/HumanVerificationModal.vue'

export default {
  name: 'MovieDetails',
  components: { HumanVerificationModal },
  computed: {
    ...mapState({
      movie: state => state.currentMovie,
      loading: state => state.loading,
      error: state => state.error
    }),
    ...mapGetters(['isAuthenticated', 'getUserRating']),
    userRating() {
      return this.getUserRating(this.movie?.id)
    }
  },
  data() {
    return {
      ratingMessage: '',
      hasBootstrapIcons: typeof window !== 'undefined' && !!document.querySelector('link[href*=bootstrap-icons]'),
      showHuman: false,
      pendingStar: null
    }
  },
  methods: {
    ...mapActions(['fetchMovieDetails', 'setRating']),
    viewMovieDetails(movieId) {
      this.$router.push(`/movie/${movieId}`)
      this.scrollToTop()
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getImageUrl,
    async rateMovie(star) {
      if(!this.$store.state.humanVerified){
        this.pendingStar = star
        this.showHuman = true
        return
      }
      try {
        await this.setRating({ movieId: this.movie.id, rating: star })
        this.ratingMessage = 'Your rating has been saved!'
        setTimeout(() => { this.ratingMessage = '' }, 2000)
      } catch(err){
        this.ratingMessage = err.message || 'Failed to rate movie.'
      }
    },
    scrollToTop() {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    onVerified() {
      this.$store.commit('SET_HUMAN_VERIFIED', true)
      this.showHuman=false
      if(this.pendingStar){
        this.rateMovie(this.pendingStar)
        this.pendingStar=null
      }
    }
  },
  created() {
    const movieId = this.$route.params.id
    if (movieId) {
      this.fetchMovieDetails(movieId)
      this.scrollToTop()
    }
    console.log('MovieDetails created. isAuthenticated:', this.isAuthenticated)
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.fetchMovieDetails(newId)
          this.scrollToTop()
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.movie-details-container {
  min-height: 100vh;
  /* Vertical gradient: deep blue at top, gradually lighter, ending in white */
  background: linear-gradient(180deg,
    #1a1c4b 0%,        /* deepest shade at top */
    #2a2f6e 20%,       /* dark segment ends a bit earlier */
    #4854a3 40%,       /* begin lighter tones slightly above mid-screen */
    #9aa3e8 60%,       /* pale lavender-blue */
    #dfe2ff 80%,       /* near-white tint */
    #ffffff 100%       /* pure white at the very bottom */
  );
  color: #FFFFFF;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.movie-details-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(103, 58, 183, 0.1), transparent 70%);
  pointer-events: none;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 2rem;
}

.glow-text {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(79, 172, 254, 0.5);
  margin-bottom: 1rem;
}

.subtitle-text {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
}

.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.movie-poster {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.02);
}

.section-title {
  color: #FFFFFF;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.genre-badge, .actor-badge {
  background: rgba(0, 0, 0, 0.35);
  color: #FFFFFF;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.star-rating {
  cursor: pointer;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.star-rating:hover {
  transform: scale(1.2);
}

.rating-value {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.login-alert {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.login-alert a {
  color: #4facfe;
  text-decoration: none;
  font-weight: 500;
}

.similar-movie-card {
  cursor: pointer;
  overflow: hidden;
}

.similar-movie-card img {
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  transition: transform 0.3s ease;
}

.similar-movie-card:hover img {
  transform: scale(1.05);
}

.similar-movie-card .card-body {
  background: rgba(0, 0, 0, 0.55);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  padding: 0.75rem 1rem;
}

.similar-movie-card .card-title {
  font-size: 1rem;
  font-weight: 600;
}

.similar-movie-card .card-text {
  font-size: 0.85rem;
}

.loading-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-border {
  color: #4facfe;
  width: 3rem;
  height: 3rem;
}

@media (max-width: 768px) {
  .glow-text {
    font-size: 2.5rem;
  }
  
  .subtitle-text {
    font-size: 1.2rem;
  }
  
  .content-section {
    padding: 0 0.5rem;
  }
}

.cast-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

.cast-name {
  font-size: 0.85rem;
  color: #ffffff;
}

.similar-movies-section {
  text-align: center;
}

.similar-movies-section .section-title {
  margin: 0 auto;
}

.similar-movies-section .section-title {
  display: inline-block;
  padding: 0.35rem 1.5rem;
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-transform: capitalize;
}

.similar-movie-card .card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
}
</style> 