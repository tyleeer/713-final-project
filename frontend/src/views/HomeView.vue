<script setup lang="ts">
import AnnouncemnetView from '../views/AnnouncementView.vue';
import StudentListView from '../views/StudentList.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// ใช้ useRouter สำหรับการรีไดเรคหน้า
const router = useRouter();
const checkAdmin = ref<boolean>(false);

// ฟังก์ชันการออกจากระบบ
const logout = () => {
  localStorage.removeItem('token'); // ลบ JWT token ออกจาก localStorage
  router.push('/login'); // รีไดเรคไปยังหน้า login
};

onMounted(() => {
  const role = localStorage.getItem("role");
  checkAdmin.value = role?.toLowerCase() == "admin";
})
</script>

<template>
  <main class="pt-2 flex flex-col items-center">
    <AnnouncemnetView v-if="!checkAdmin" />
    <StudentListView v-if="checkAdmin" />
  </main>
</template>

<style scoped>
h1 {
  color: #3F72AF;
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
