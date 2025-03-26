

<template>
  <header class="fixed-navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="logo">
        <span class="logo-text">YourApp</span>
      </RouterLink>
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/announcement" class="nav-link" v-if="isAuthenticated && userRole === 'student'">Announcement</RouterLink>
        <RouterLink to="/login" class="nav-link" v-if="!isAuthenticated">Login</RouterLink>
        <RouterLink to="/register" class="nav-link" v-if="!isAuthenticated">Register</RouterLink>
        <a href="#" class="nav-link" v-if="isAuthenticated" @click.prevent="logout">Logout</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.fixed-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #3f72af;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
}

.logo {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #f9f7f7;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #f9f7f7;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #f9f7f7;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link:hover::before {
  transform: scaleX(1);
}

.nav-link:hover {
  background-color: rgba(249, 247, 247, 0.2);
}

.nav-link.router-link-exact-active {
  background-color: rgba(249, 247, 247, 0.2);
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 15px;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isAuthenticated = ref(false)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    isAuthenticated.value = true
  }
})

const logout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  window.location.href = '/'
}
</script>