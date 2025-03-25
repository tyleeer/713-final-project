<template>
  <header class="navbar">
    <nav>
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/login" class="nav-link">Login</RouterLink>
      <RouterLink to="/register" class="nav-link">Register</RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
// ไม่จำเป็นต้องมี RouterView ใน Navbar
</script>

<style scoped>
.navbar {
  background-color: #3f72af;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-link {
  color: #f9f7f7;
  text-decoration: none;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-radius: 5px;
}

.nav-link:hover {
  color: #112d4e;
  background-color: #f9f7f7;
}

.nav-link.router-link-exact-active {
  background-color: rgba(249, 247, 247, 0.2);
}
</style>