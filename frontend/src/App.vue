<template>
  <div>
    <Navbar />
    <RouterView />
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
}

.sidebar {
  display: none; /* ทดสอบว่ามันเป็นสาเหตุของแถบดำหรือเปล่า */
}
</style>