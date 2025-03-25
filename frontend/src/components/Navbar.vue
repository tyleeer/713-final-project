<template>
  <header class="navbar">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/reset-password">Forgot Password</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
// ไม่จำเป็นต้องมีการเขียน logic ที่นี่ หากใช้ `RouterLink` ไปยังเส้นทางที่เกี่ยวข้อง
</script>

<style scoped>
.navbar {
  background-color: #3f72af; /* ใช้สีจากโทนสีของคุณ */
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000; /* ทำให้ navbar อยู่เหนือเนื้อหาหน้า */
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

nav {
  display: flex;
  gap: 20px; /* ระยะห่างระหว่างลิงก์ */
}

nav a {
  color: #f9f7f7; /* สีขาว */
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  color: #112d4e; /* สีเข้มเมื่อ hover */
}
</style>
