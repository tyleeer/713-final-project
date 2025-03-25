<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// สร้างข้อความต้อนรับ
const message = ref('Welcome to the Home Page!');

// ใช้ useRouter สำหรับการรีไดเรคหน้า
const router = useRouter();

// ฟังก์ชันการออกจากระบบ
const logout = () => {
  localStorage.removeItem('token'); // ลบ JWT token ออกจาก localStorage
  router.push('/login'); // รีไดเรคไปยังหน้า login
};
</script>

<template>
  <main class="home-page">
    <h1>{{ message }}</h1> <!-- แสดงข้อความต้อนรับ -->
    <TheWelcome /> <!-- แสดงคอมโพเนนต์ TheWelcome -->
    <button @click="logout">Logout</button> <!-- ปุ่มออกจากระบบ -->
  </main>
</template>

<style scoped>
.home-page {
  text-align: center;
  margin-top: 50px;
  background-color: #F9F7F7; /* สีพื้นหลัง */
  color: #112D4E; /* สีข้อความหลัก */
  font-family: Arial, sans-serif;
}

h1 {
  color: #3F72AF; /* สีของข้อความ */
  font-size: 2rem;
}

button {
  padding: 10px 20px;
  background-color: #3F72AF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #DBE2EF;
  color: #112D4E;
}

.card {
  background-color: #DBE2EF;
  border: 1px solid #3F72AF;
  padding: 20px;
  margin-top: 20px;
}

button:focus {
  outline: none;
}
</style>
