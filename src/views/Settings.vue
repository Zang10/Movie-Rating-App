<template>
  <div class="settings-page container py-4">
    <h2 class="mb-4">Settings</h2>
    <div class="card p-4 settings-card">
      <form @submit.prevent="updatePassword">
        <h5 class="mb-3">Update Password</h5>
        <div class="mb-3">
          <input v-model="password" type="password" class="form-control" placeholder="New Password" required />
        </div>
        <button class="btn btn-primary mb-3" type="submit">Update Password</button>
        <div v-if="passwordMsg" class="text-success small mb-2">{{ passwordMsg }}</div>
      </form>
      <hr />
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" id="notifSwitch" v-model="notifications">
        <label class="form-check-label" for="notifSwitch">Enable Notifications</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      password: '',
      passwordMsg: '',
      notifications: true
    }
  },
  mounted() {
    this.notifications = localStorage.getItem('notifications') !== 'false'
  },
  methods: {
    updatePassword() {
      this.passwordMsg = 'Password updated! (demo only)'
      this.password = ''
      setTimeout(() => { this.passwordMsg = '' }, 2000)
    }
  }
}
</script>

<style scoped>
.settings-card {
  max-width: 400px;
  margin: auto;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
</style> 