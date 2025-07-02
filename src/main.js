import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// If you use BootstrapVue3, import and use it as well:
// import { BootstrapVue3 } from 'bootstrap-vue-3'
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const app = createApp(App)

app.use(store)
app.use(router)
// app.use(BootstrapVue3) // Uncomment if using BootstrapVue3

app.mount('#app') 