<template>
  <div class="profile-page container py-4">
    <h2 class="mb-4">Profile</h2>
    <div class="card p-4 profile-card">
      <div class="d-flex align-items-center mb-3">
        <img :src="userPic" alt="Profile Picture" class="profile-pic me-3" />
        <div>
          <h4 class="mb-1">{{ user?.username || 'Guest' }}</h4>
          <p class="mb-0 text-muted">{{ user?.email || 'user@email.com' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user']),
    userPic() {
      // Use a placeholder or user.profilePic if available
      return this.user && this.user.profilePic
        ? this.user.profilePic
        : 'https://ui-avatars.com/api/?name=' + (this.user?.username || 'User') + '&background=2563eb&color=fff&size=128'
    }
  }
}
</script>

<style scoped>
.profile-card {
  max-width: 400px;
  margin: auto;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.profile-pic {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2563eb;
  background: #f3f4f6;
}
</style> 