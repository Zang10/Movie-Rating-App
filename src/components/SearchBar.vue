<template>
  <div class="search-bar position-relative d-flex align-items-center">
    <input
      v-model="term"
      @keyup.enter="trigger"
      type="text"
      class="form-control search-input pe-5"
      placeholder="Search movies…"
    />
    <button class="search-icon" @click="trigger">
      <i class="bi bi-search"></i>
    </button>
    <button class="filter-pill ms-2" @click="$emit('filter')">Filter</button>
  </div>
</template>

<script setup>
/* eslint-disable no-undef, no-unused-vars */
import { ref } from 'vue'
const term = ref('')
const emit = defineEmits(['search','filter'])
const trigger = ()=>{ if(term.value.trim()) emit('search', term.value.trim()) }

const genreOptions = [
  { id: 28,  name: 'Action'   },
  { id: 35,  name: 'Comedy'   },
  { id: 18,  name: 'Drama'    },
  { id: 27,  name: 'Horror'   },
  { id: 10749,name: 'Romance' },
  { id: 878, name: 'Sci-Fi'   }
  // add more TMDB genres here if you like
]

const languageOptions = [
  { code:'en', name:'English' },
  { code:'hi', name:'Hindi'   },
  { code:'ko', name:'Korean'  },
  { code:'ja', name:'Japanese'}
  // add more if needed
]
</script>

<style scoped>
.search-input{
  background:#ffffff;
  border:1px solid #e5e7eb;
  color:#111827;
  border-radius:0.5rem;
  padding:0.55rem 0.9rem;
  min-width:260px;
  font-size:0.9rem;
}
.search-input::placeholder{color:#6b7280;}
.search-icon{
  position:absolute;
  right:12px;
  background:none;
  border:none;
  padding:0;
  color:#111827;
  font-size:1.1rem;
  cursor:pointer;
}
.filter-pill{
  background:#000000;
  color:#ffffff;
  border:none;
  border-radius:0.5rem;
  padding:0.45rem 0.9rem;
  font-size:0.9rem;
  cursor:pointer;
}
.filter-pill:hover{background:#1f2937;}
</style> 



