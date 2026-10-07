<template>
  <div class="hero-carousel" v-if="slides.length">
    <div
      class="slide"
      v-for="(slide, idx) in slides"
      :key="slide.id"
      :class="{ active: idx === currentIndex }"
      :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${slide.backdrop_path})` }"
    >
      <div class="overlay">
        <div class="badge">{{ idx + 1 }} / {{ slides.length }}</div>
        <h2 class="title">{{ slide.title }}</h2>
        <p class="overview" v-if="slide.overview">{{ truncate(slide.overview) }}</p>
        <router-link :to="`/movie/${slide.id}`" class="rateflix-btn rateflix-btn-accent">
          <i class="bi bi-play-fill me-1"></i> Watch details
        </router-link>
      </div>
      <!-- arrows -->
      <button class="arrow left" @click="prevSlide"><span class="arrow-symbol">&#8249;</span></button>
      <button class="arrow right" @click="nextSlide"><span class="arrow-symbol">&#8250;</span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroCarousel',
  props: {
    slides: {
      type: Array,
      required: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 8000
    }
  },
  data() {
    return {
      currentIndex: 0,
      timer: null
    }
  },
  mounted() {
    this.startAuto()
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    startAuto() {
      if (!this.autoPlay) return
      this.timer = setInterval(this.nextSlide, this.interval)
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length
    },
    truncate(text, len = 120) {
      return text.length > len ? text.slice(0, len) + '…' : text
    }
  }
}
</script>

<style scoped>
.hero-carousel {
  position: relative;
  width: 100%;
  padding-top: 40%; /* aspect ratio 2.5:1 */
  overflow: hidden;
}
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.7s ease;
}
.slide.active {
  opacity: 1;
}
.overlay {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  max-width: 60%;
}
.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.overview {
  font-size: 1rem;
  margin-bottom: 1rem;
}
.badge {
  display: inline-block;
  background: rgba(0,0,0,0.6);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.85);
  border: none;
  color: #111;
  padding: 0.6rem 0.9rem;
  font-size: 1.75rem;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.arrow.left { left: 1.25rem; }
.arrow.right { right: 1.25rem; }
.arrow:hover { background: rgba(255,255,255,1); }
.arrow-symbol {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}
</style> 