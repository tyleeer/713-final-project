<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <h1 class="reset-password-title">Reset Password</h1>
      <form @submit.prevent="resetPassword">
        <!-- Student ID -->
        <div class="form-group">
          <label for="studentId" class="form-label">Username</label>
          <input v-model="studentId" type="text" class="form-control" id="studentId" placeholder="Enter your student ID"
            required />
        </div>

        <!-- Old Password -->
        <div class="form-group">
          <label for="oldPassword" class="form-label">Old Password</label>
          <input v-model="oldPassword" type="password" class="form-control" id="oldPassword"
            placeholder="Enter your old password" required />
        </div>

        <!-- New Password -->
        <div class="form-group">
          <label for="newPassword" class="form-label">New Password</label>
          <input v-model="newPassword" type="password" class="form-control" id="newPassword"
            placeholder="Enter your new password" required :disabled="isOldPasswordIncorrect" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isOldPasswordIncorrect">Reset Password</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { http } from '@/utils';
export default {
  data() {
    return {
      studentId: '',
      oldPassword: '',
      newPassword: '',
      errorMessage: '',
      isOldPasswordIncorrect: false, // To track if old password is correct
    };
  },
  methods: {
    async resetPassword() {
      try {
        // Validate Student ID and Old Password
        const response = await http.post('auth/reset-password', {
          studentId: this.studentId,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        if (response.data.isOldPasswordIncorrect) {
          this.isOldPasswordIncorrect = true;
          this.errorMessage = 'Old password is incorrect';
          return;
        }
        this.isOldPasswordIncorrect = false;
        this.errorMessage = '';
        this.$router.push('/login'); // Redirect to login page after password reset
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Error resetting password';
      }
    },
  },
};
</script>

<style scoped>
/* การตั้งค่าสไตล์หลัก */
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* ทำให้ความสูงของหน้าเต็มหน้าจอ */
  margin: 0;
  padding: 0;
}

/* สไตล์สำหรับการ์ด Reset Password */
.reset-password-card {
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  /* ขนาดกล่อง Reset Password */
  text-align: center;
  box-sizing: border-box;
  min-height: 350px;
  /* ความสูงขั้นต่ำของการ์ด */
}

/* สไตล์สำหรับหัวข้อ Reset Password */
.reset-password-title {
  color: #3F72AF;
  /* สีหัวข้อ */
  font-size: 2rem;
  margin-bottom: 20px;
}

/* สไตล์สำหรับฟอร์ม */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-label {
  font-weight: bold;
  color: #112D4E;
  /* สีของข้อความ */
}

.form-control {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #3F72AF;
  width: 100%;
  font-size: 1rem;

}

input.form-control {
  color: #202020;
}

.form-control:focus {
  border-color: #112D4E;
  /* สีของกรอบเมื่อมีการคลิก */
}

/* สไตล์สำหรับปุ่ม Reset Password */
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

button:disabled {
  background-color: #D1D1D1;
  /* สีพื้นหลังเมื่อปุ่มถูกปิดใช้งาน */
}

/* สไตล์ข้อความผิดพลาด */
.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
}
</style>
