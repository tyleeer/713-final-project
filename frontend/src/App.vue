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
  background-color: white; /* Set the background color to white */
}

#app {
  min-height: 100dvh;
  min-width: 100dvw;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex-direction: column;
  margin-top: 86px;
  height: calc(100vh - 86px);
}

.sidebar {
  display: none; /* Commented out for testing purposes */
}

@media (max-width: 768px) {
  .main-content {
      margin-top: 141px;
      height: calc(100vh - 141px);
    }
}
</style>
