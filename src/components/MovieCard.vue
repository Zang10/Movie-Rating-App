<template>
  <div class="movie-card" @click="onSelect">
    <img
      :src="imageSrc"
      :alt="movie.title"
      class="poster-img"
      @error="onError"
    />
    <div class="info-wrapper">
      <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
      <p class="meta">{{ metaLine }}</p>
    </div>
    <span class="rating-badge">{{ rating }}</span>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: { type: Object, required: true }
  },
  computed: {
    imageSrc() {
      return this.movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image'
    },
    metaLine() {
      const year = this.movie.release_date ? new Date(this.movie.release_date).getFullYear() : 'N/A'
      return `Movie • ${year}`
    },
    rating() {
      return this.movie.vote_average ? this.movie.vote_average.toFixed(1) : 'N/A'
    }
  },
  methods: {
    onError(e) {
      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image'
    },
    onSelect() {
      this.$emit('select', this.movie.id)
    }
  }
}
</script>

<style scoped>
.movie-card {
  position: relative;
  background: #1e293b; /* slate-800 */
  border: 1px solid #334155; /* slate-700 */
  border-radius: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.movie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.45);
}

.poster-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.info-wrapper {
  padding: 0.75rem 0.9rem 1rem;
}

.title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f3f4f6;
  margin: 0 0 0.25rem 0;
  line-height: 1.25;
}

.meta {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.rating-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #0A84FF;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0 0.35rem;
  border-radius: 0.25rem;
}
</style> 