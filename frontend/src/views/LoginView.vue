<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">กรุณาเข้าสู่ระบบ</h1>
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="email" class="form-label">Username</label>
          <input v-model="email" type="username" class="form-control" id="email" placeholder="Enter your username"
            required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password"
            required />
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <div class="reset-password">
          <router-link to="/reset-password" class="text-primary!">Forgot Password?</router-link> <!-- ลิงก์ไปยังหน้า Forgot Password -->
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { http } from '@/utils';
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await http.post('auth/login', {
          email: this.email,
          password: this.password,
          role: this.role,
        });


        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        window.location.href = '/'; // Redirect to Announcement page using JavaScript
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Invalid credentials';
      }
    },
  },
};


</script>

<style scoped>
/* การตั้งค่าสไตล์หลัก */
.login-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.reset-password {
  margin-top: 0.5rem;
  text-align: right;
}

.login-container {
  margin: auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  padding: 0;
}

.login-card {
  background-color: #DBE2EF;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  /* ลบ border สีแดงทดสอบ */
}

.login-box {
  background: #dde5f4;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}




/* สไตล์สำหรับการ์ด Login */
.login-card {
  background-color: #DBE2EF;
  /* สีพื้นหลังของการ์ด */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  /* ขนาดกล่อง login */
  text-align: center;
  box-sizing: border-box;
  min-height: 300px;
  /* ความสูงขั้นต่ำของการ์ด login */
}

/* สไตล์สำหรับหัวข้อ Login */
.login-title {
  color: #3F72AF;
  /* สีหัวข้อ */
  font-size: 2rem;
  margin-bottom: 20px;
}

/* สไตล์สำหรับฟอร์ม */
.form-group {
  margin-bottom: 20px;
  text-align: left;
  /* กำหนดให้ชิดซ้าย */
}

.form-label {
  font-weight: bold;
  color: #112D4E;
  /* สีของข้อความ */
}

.form-control {
  color: #202020;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #3F72AF;
  width: 100%;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #112D4E;
  /* สีของกรอบเมื่อมีการคลิก */
  box-shadow: 0 0 5px rgba(17, 45, 78, 0.2);
}

/* สไตล์สำหรับปุ่ม Login */
button {
  width: 100%;
  padding: 10px;
  background-color: #3F72AF;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

button:hover {
  background-color: #112D4E;
  /* เมื่อ hover จะเปลี่ยนเป็นสีเข้ม */
}

/* สไตล์ข้อความผิดพลาด */
.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
}
</style>