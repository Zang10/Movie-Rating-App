<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg rateflix-navbar-dark" role="navigation">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="@/assets/rf-logo.svg" alt="Ratefl!x logo" height="28" class="me-2" />
          <span class="brand-text">Ratefl!x</span>
        </router-link>
        <div class="d-none d-lg-block ms-4" style="width:300px;">
          <SearchBar @search="onGlobalSearch" @filter="showFilter=true" />
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/movies">Movies</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li v-else class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="user-avatar me-2">{{ userInitials }}</span>
                {{ user.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Global filter panel -->
    <FilterPanel :open="showFilter" @close="showFilter=false" @apply="applyFilter" />

    <router-view/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SearchBar from '@/components/SearchBar.vue'
import FilterPanel from '@/components/FilterPanel.vue'

export default {
  name: 'App',
  components: { SearchBar, FilterPanel },
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
    userInitials() {
      if (!this.user || !this.user.username) return ''
      return this.user.username.slice(0, 2).toUpperCase()
    }
  },
  data() {
    return {
      showFilter: false
    }
  },
  methods: {
    ...mapActions(['logout']),
    onGlobalSearch(term){
      this.$router.push({ path:'/movies', query:{ q: term } })
    },
    applyFilter(params){
      this.showFilter=false
      const newQuery={ ...this.$route.query, ...params }
      this.$router.push({ path:'/movies', query:newQuery })
    }
  }
}
</script>

<style>
:root {
  --rateflix-dark: #1a1a1a;
  --rateflix-gray: #2d2d2d;
  --rateflix-primary: #2563eb;    /* Main blue */
  --rateflix-hover: #1d4ed8;      /* Darker blue for hover */
  --rateflix-disabled: #93c5fd;   /* Light blue for disabled state */
  --rateflix-white: #FFFFFF;
}

body, .app, #app {
  font-family: 'Noto Serif', serif;
  background-color: #0f1626 !important;
  color: var(--rateflix-white) !important;
}

/* Dark navbar */
.rateflix-navbar-dark {
  background: #111827 !important;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
  height: 64px;
  padding: 0 2vw;
}

.rateflix-navbar-dark .navbar-brand,
.rateflix-navbar-dark .nav-link {
  color: var(--rateflix-white) !important;
}

.rateflix-navbar-dark .nav-link.router-link-active {
  color: var(--rateflix-primary) !important;
  border-bottom-color: var(--rateflix-primary);
}

.navbar-brand {
  font-weight: 400;
  font-size: 1.2rem;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  text-shadow: none !important;
  font-family: inherit;
}

.nav-link {
  color: var(--rateflix-white) !important;
  font-weight: 400;
  font-size: 1.05rem;
  margin-left: 2.2rem;
  margin-right: 0;
  background: none !important;
  border: none !important;
  border-radius: 0;
  outline: none;
  padding: 0;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  height: 48px;
}

.nav-link.router-link-active {
  color: var(--rateflix-primary) !important;
  font-weight: 500;
  border-bottom: 2px solid var(--rateflix-primary);
  background: none !important;
}

.nav-link:hover {
  color: #bbbbbb !important;
}

.section-title {
  color: var(--rateflix-white);
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--rateflix-primary), #00ff88);
  border-radius: 2px;
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--rateflix-primary);
  color: var(--rateflix-white);
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: 0.5rem;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.2);
}

/* Strong blue boundary for accent buttons (View Details, Watch Details, Browse All Movies) */
.rateflix-btn-accent {
  background: var(--rateflix-primary) !important;
  color: var(--rateflix-white) !important;
  border: 2.5px solid #0A84FF !important;
  border-radius: 0.35rem !important;
  font-weight: 700;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 0 0 3px rgba(10,132,255,0.15) !important;
  outline: none !important;
}

.rateflix-btn-accent:hover:not(:disabled) {
  background: var(--rateflix-hover) !important;
  border-color: #2563eb !important;
  transform: translateY(-1px) scale(1.04);
  text-decoration: none;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.18) !important;
}

.rateflix-btn-accent:disabled {
  background: var(--rateflix-disabled) !important;
  color: #EFEFEF !important;
  border-color: #93c5fd !important;
  opacity: 0.7;
  box-shadow: none !important;
}

.brand-text {
  font-family: 'Merriweather', serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--rateflix-white);
  text-transform: lowercase;
  letter-spacing: .5px;
}

.footer-text {
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--rateflix-white);
}
</style> 