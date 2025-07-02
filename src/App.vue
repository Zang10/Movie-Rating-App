<style>
:root {
  --rateflix-dark: #1a1a1a;
  --rateflix-gray: #2d2d2d;
  --rateflix-primary: #2563eb;
  --rateflix-hover: #1d4ed8;
  --rateflix-disabled: #93c5fd;
  --rateflix-white: #FFFFFF;
}
body, .app, #app {
  font-family: 'Noto Serif', serif;
  background-color: #0f1626 !important;
  color: var(--rateflix-white) !important;
}
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

/* 1. Hamburger menu icon pure white and visible */
.navbar-toggler {
  border-color: #fff !important;
  box-shadow: 0 0 0 2px #fff2 !important;
}
.navbar-toggler:focus, .navbar-toggler[aria-expanded="true"] {
  border-color: #fff !important;
  box-shadow: 0 0 0 3px #fff5 !important;
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

/* 2 & 3. Collapsed menu background and readable links on mobile */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background: #111827 !important;
    border-radius: 0 0 1rem 1rem;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
    padding-bottom: 1rem;
    border: 2px solid #fff !important;
  }
  .navbar-nav .nav-link {
    color: #fff !important;
    font-size: 1.2rem;
    padding: 0.75rem 1.5rem;
    text-align: left;
    border: 1.5px solid #fff !important;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    background: rgba(255,255,255,0.04);
  }
}

/* 2. Hero/summary section min-height and padding for mobile */
.hero-container {
  min-height: 220px;
  padding: 1.5rem 1rem;
}
@media (max-width: 600px) {
  .hero-container {
    min-height: 180px;
    padding: 1rem 0.5rem;
  }
  .hero-container .lead, .hero-container .movie-summary {
    font-size: 1rem;
    line-height: 1.4;
  }
}
</style> 