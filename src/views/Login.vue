<template>
  <div class="login-container">
    <div class="card mx-auto" style="max-width: 400px;">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">{{ isRegister ? 'Register' : 'Login' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input v-model="username" type="text" class="form-control" id="username" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="password" required />
          </div>
          <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
          <button type="submit" class="rateflix-btn rateflix-btn-primary w-100 mb-2">
            {{ isRegister ? 'Register' : 'Login' }}
          </button>
        </form>
        <button class="rateflix-btn rateflix-btn-link w-100" @click="toggleMode">
          {{ isRegister ? 'Already have an account? Login' : "Don't have an account? Register" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const store = useStore()
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const isRegister = ref(false)

    const handleSubmit = async () => {
      error.value = ''
      try {
        if (isRegister.value) {
          await store.dispatch('register', { username: username.value, password: password.value })
        } else {
          await store.dispatch('login', { username: username.value, password: password.value })
        }
        router.push('/')
      } catch (err) {
        error.value = err.message || 'An error occurred'
      }
    }

    const toggleMode = () => {
      isRegister.value = !isRegister.value
      error.value = ''
    }

    return {
      username,
      password,
      error,
      isRegister,
      handleSubmit,
      toggleMode
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}
</style> 