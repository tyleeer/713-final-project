<template>
  <div id="app">
    <Navbar />
    <div class="main-content overflow-y-scroll">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<style>
html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: white; /* Set the background color to white */
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers the content vertically */
  align-items: center; /* Centers the content horizontally */
  padding: 0 10px; /* Add padding to prevent content from touching the edges */
  margin-top: 80px;
}

.sidebar {
  display: none; /* Commented out for testing purposes */
}
</style>
