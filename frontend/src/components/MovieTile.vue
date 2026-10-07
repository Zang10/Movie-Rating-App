<template>
  <div class="movie-tile" @click="$emit('select')">
    <div class="poster-wrapper">
      <img
        :src="posterSrc"
        :alt="movie.title"
        @error="onImgErr"
      />
      <span v-if="movie.vote_average" class="rating-chip">{{ movie.vote_average.toFixed(1) }}</span>
    </div>
    <h3 class="title" :title="movie.title">{{ movie.title }}</h3>
    <p class="meta">Movie • {{ runtime }}</p>
  </div>
</template>

<script>
import { getImageUrl } from '@/api/tmdb'
export default {
  name: 'MovieTile',
  props: { movie: { type: Object, required: true } },
  computed: {
    posterSrc() {
      return getImageUrl(this.movie.poster_path) || 'https://via.placeholder.com/300x450?text=No+Image'
    },
    runtime() {
      return this.movie.runtime ? `${this.movie.runtime}m` : `${new Date(this.movie.release_date).getFullYear()}`
    }
  },
  methods: {
    onImgErr(e) { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image' }
  }
}
</script>

<style scoped>
.movie-tile {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.poster-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 0.35rem;
  transition: transform 0.25s ease, filter 0.25s ease;
}
.movie-tile:hover .poster-wrapper { transform: translateY(-3px); filter: brightness(1.05); }
.poster-wrapper img {
  width: 100%;
  display: block;
  aspect-ratio: 2/3;
  object-fit: cover;
}
.rating-chip {
  position: absolute;
  top: 0.35rem;
  left: 0.35rem;
  background: #0A84FF;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0 0.3rem;
  border-radius: 2px;
}
.title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}
.meta {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}
</style> 