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
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* ป้องกันการเลื่อนแนวนอน */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* ทำให้เต็มหน้าจอ */
}

.main-content {
  flex: 1; /* ขยายเนื้อหาให้เต็มจอ */
  padding: 20px; /* เพิ่มพื้นที่ให้ไม่ติดขอบ */
}

</style>
