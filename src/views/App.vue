<template>
  <div id="app" class="app-grid">
    <!-- Navbar (always at top) -->
    <nav class="navbar navbar-expand-lg rateflix-navbar-dark sticky-top" role="navigation">
      <div class="container-fluid px-3 px-md-5">
        <!-- Brand -->
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img src="@/assets/rf-logo.svg" alt="Ratefl!x logo" height="28" class="me-2" />
          <span class="brand-text">Ratefl!x</span>
        </router-link>

        <!-- Mobile toggle button -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapsible Nav Content -->
        <div class="collapse navbar-collapse mt-2 mt-lg-0" id="navbarNav">
          <!-- Search (full width on small, inline on large) -->
          <div class="searchbar-wrapper w-100 mb-2 mb-lg-0">
            <SearchBar @search="onGlobalSearch" @filter="showFilter = true" />
          </div>

          <!-- Nav links -->
          <ul class="navbar-nav ms-auto d-flex align-items-lg-center gap-3">
            <li class="nav-item"><router-link class="nav-link" to="/" @click="closeNavbar">Home</router-link></li>
            <li class="nav-item"><router-link class="nav-link" to="/movies" @click="closeNavbar">Movies</router-link></li>
            <li v-if="!isAuthenticated" class="nav-item"><router-link class="nav-link" to="/login" @click="closeNavbar">Login</router-link></li>
            <li v-else class="nav-item dropdown" :class="{ show: userDropdownOpen }">
              <button
                class="nav-link user-menu dropdown-toggle d-flex align-items-center"
                id="userDropdown"
                role="button"
                :aria-expanded="userDropdownOpen ? 'true' : 'false'"
                type="button"
                @click="toggleUserDropdown"
              >
                <span class="user-avatar me-2">{{ userInitials }}</span>
                {{ user.username }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: userDropdownOpen }" aria-labelledby="userDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="goToProfile">Profile</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="goToSettings">Settings</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Grid Content -->
    <div class="main-content-grid">
      <!-- FilterPanel on the side -->
      <FilterPanel
        class="filter-panel"
        :open="showFilter"
        @close="showFilter = false"
        @apply="applyFilter"
      />

      <!-- Main router-view -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
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
      showFilter: false,
      userDropdownOpen: false,
      navbarOpen: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    // Sync navbarOpen with Bootstrap collapse events
    const navbar = document.getElementById('navbarNav')
    if (navbar) {
      navbar.addEventListener('shown.bs.collapse', () => { this.navbarOpen = true })
      navbar.addEventListener('hidden.bs.collapse', () => { this.navbarOpen = false })
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    ...mapActions(['logout']),
    onGlobalSearch(term) {
      this.$router.push({ path: '/movies', query: { q: term } })
    },
    applyFilter(params) {
      this.showFilter = false
      const newQuery = { ...this.$route.query, ...params }
      this.$router.push({ path: '/movies', query: newQuery })
    },
    closeNavbar() {
      this.navbarOpen = false
      const navbar = document.getElementById('navbarNav')
      if (navbar && navbar.classList.contains('show') && window.bootstrap) {
        const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbar)
        bsCollapse.hide()
      }
    },
    toggleNavbar(event) {
      event && event.stopPropagation()
      this.navbarOpen = !this.navbarOpen
      const navbar = document.getElementById('navbarNav')
      if (navbar && window.bootstrap) {
        const bsCollapse = window.bootstrap.Collapse.getOrCreateInstance(navbar)
        if (this.navbarOpen) {
          bsCollapse.show()
        } else {
          bsCollapse.hide()
        }
      }
    },
    toggleUserDropdown(event) {
      this.userDropdownOpen = !this.userDropdownOpen
      event && event.stopPropagation()
    },
    handleOutsideClick(event) {
      const dropdown = document.getElementById('userDropdown')
      if (this.userDropdownOpen && dropdown && !dropdown.contains(event.target)) {
        this.userDropdownOpen = false
      }
      const navbar = document.getElementById('navbarNav')
      const toggler = document.querySelector('.navbar-toggler')
      if (
        this.navbarOpen &&
        navbar &&
        !navbar.contains(event.target) &&
        toggler &&
        !toggler.contains(event.target)
      ) {
        this.closeNavbar()
      }
    },
    goToProfile() {
      this.userDropdownOpen = false
      this.$router.push('/profile')
      this.closeNavbar()
    },
    goToSettings() {
      this.userDropdownOpen = false
      this.$router.push('/settings')
      this.closeNavbar()
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
  border: none !important;
  font-family: inherit;
}

.nav-link {
  color: var(--rateflix-white) !important;
  font-weight: 400;
  font-size: 1.05rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  height: auto;
}

.nav-link.router-link-active {
  color: var(--rateflix-primary) !important;
  font-weight: 500;
  border-bottom: 2px solid var(--rateflix-primary);
}

.nav-link:hover {
  color: #bbbbbb !important;
}

@media (max-width: 991.98px) {
  .navbar-nav .nav-link,
  .navbar-nav .user-menu {
    color: #fff !important;
    font-size: 1.2rem;
    font-weight: bold;
    text-shadow: 0 1px 4px rgba(0,0,0,0.35);
    padding: 1.3rem 2.2rem;
    text-align: left;
    border: none !important;
    border-radius: 0.7rem;
    margin-bottom: 0.75rem;
    background: rgba(20, 20, 30, 0.85);
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    transition: background 0.2s, color 0.2s;
  }
  .navbar-nav .nav-link:hover, .navbar-nav .nav-link:focus,
  .navbar-nav .user-menu:hover, .navbar-nav .user-menu:focus {
    background: rgba(40, 40, 60, 0.95);
    color: #fff !important;
  }
  .navbar-nav .user-menu .user-avatar {
    margin-right: 0.8rem;
    margin-bottom: 0;
    width: 34px;
    height: 34px;
    font-size: 1.15rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .navbar-nav {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

.navbar-toggler {
  border: none;
  outline: none;
  box-shadow: none;
}

.navbar-toggler .navbar-toggler-icon,
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='white' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E") !important;
  background-size: 80% 80% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  filter: none !important;
  opacity: 1 !important;
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
  border: 2.5px solid #0A84FF;
}

/* Strong blue boundary for accent buttons */
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

/* Updated Searchbar Wrapper Styles */
.searchbar-wrapper {
  max-width: 350px;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
}

/* Force search-bar and input inside wrapper to full width */
.searchbar-wrapper .search-bar,
.searchbar-wrapper .search-input {
  width: 100% !important;
  min-width: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .searchbar-wrapper {
    max-width: 100%;
    margin: 0.5rem 0;
    padding: 0 1rem;
  }
  .searchbar-wrapper .search-bar,
  .searchbar-wrapper .search-input {
    width: 100% !important;
    min-width: 0 !important;
  }
}

/* Username menu item consistent nav style */
.nav-link.user-menu {
  color: var(--rateflix-white) !important;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 1rem 1.5rem;
  border-radius: 0.7rem;
  margin-bottom: 0.75rem;
  background: rgba(20, 20, 30, 0.85);
  text-shadow: 0 1px 4px rgba(0,0,0,0.35);
  letter-spacing: 0.5px;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition: background 0.2s, color 0.2s;
}
.nav-link.user-menu:hover, .nav-link.user-menu:focus {
  background: rgba(40, 40, 60, 0.95);
  color: #fff !important;
}
@media (min-width: 992px) {
  .nav-link.user-menu {
    font-size: 1.05rem;
    padding: 0.5rem 0;
    background: none;
    margin-bottom: 0;
    border-radius: 0.7rem;
    text-shadow: none;
    box-shadow: none;
  }
}
</style>
