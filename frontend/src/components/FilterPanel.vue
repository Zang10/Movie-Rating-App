<template>
  <Teleport to="body">
    <transition name="slide">
      <div v-if="open" class="filter-backdrop" @click.self="$emit('close')">
        <div class="filter-card">
          <h4 class="mb-4">Filter</h4>

          <!-- Genre -->
          <section class="mb-3">
            <h6 class="section-title">Genre</h6>
            <span v-for="g in genreOptions"
                  :key="g.id"
                  :class="['chip', { active: filter.genres.includes(g.id) }]"
                  @click="toggleGenre(g.id)"
            >{{ g.name }}</span>
          </section>

          <!-- Year range -->
          <section class="mb-3">
            <h6 class="section-title">Release Year</h6>
            <div class="year-range">
              <input v-model.number="filter.start" type="number" placeholder="From" min="1900" max="2099" />
              <span>—</span>
              <input v-model.number="filter.end" type="number" placeholder="To" min="1900" max="2099" />
            </div>
          </section>

          <!-- Rating -->
          <section class="mb-3">
            <h6 class="section-title">Min Rating</h6>
            <div class="d-flex align-items-center gap-3">
              <input v-model.number="filter.rating" type="range" min="0" max="10" step="0.5" />
              <span>{{ filter.rating }}</span>
            </div>
          </section>

          <!-- Language -->
          <section class="mb-4">
            <h6 class="section-title">Language</h6>
            <select v-model="filter.lang" class="select">
              <option v-for="l in languageOptions" :key="l.code" :value="l.code">{{ l.name }}</option>
            </select>
          </section>

          <button class="rateflix-btn rateflix-btn-accent" @click="apply">Apply</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    open: { type: Boolean, default: false }
  },
  data() {
    return {
      genreOptions: [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' },
        { id: 18, name: 'Drama' },
        { id: 27, name: 'Horror' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Sci-Fi' }
      ],
      languageOptions: [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ko', name: 'Korean' },
        { code: 'ja', name: 'Japanese' }
      ],
      filter: {
        genres: [],
        start: '',
        end: '',
        rating: 0,
        lang: 'en'
      }
    }
  },
  methods: {
    toggleGenre(id) {
      const idx = this.filter.genres.indexOf(id)
      idx === -1 ? this.filter.genres.push(id) : this.filter.genres.splice(idx, 1)
    },
    apply() {
      this.$emit('apply', { ...this.filter })
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.filter-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4rem;
  z-index: 1100;
}
.filter-card {
  background: #1e293b;
  color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}
/* Medium heading sizes */
.filter-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
}
.filter-card h6.section-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.chip {
  display: inline-block;
  padding: 0.35rem 0.8rem;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  margin: 0.2rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: #ffffff;
}
.chip.active {
  background: #e50914;
  border-color: #e50914;
}
.year-range input {
  width: 5rem;
  background: #111827;
  border: 1px solid #334155;
  color: #fff;
  padding: 0.3rem 0.5rem;
  border-radius: 0.4rem;
}
.year-range span { color: #fff; margin: 0 0.5rem; }
.select {
  background: #111827;
  border: 1px solid #334155;
  color: #fff;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
}
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from { transform: translateY(-15px); opacity: 0; }
.slide-leave-to { transform: translateY(-15px); opacity: 0; }
</style> 