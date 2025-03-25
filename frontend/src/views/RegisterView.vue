<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Register</h1>
      <form @submit.prevent="registerUser">
        <!-- Student ID -->
        <div class="form-group">
          <label for="studentId" class="form-label">Student ID</label>
          <input v-model="studentId" type="text" class="form-control" id="studentId" placeholder="Enter your student ID" required />
        </div>

        <!-- First Name -->
        <div class="form-group">
          <label for="firstName" class="form-label">First Name</label>
          <input v-model="firstName" type="text" class="form-control" id="firstName" placeholder="Enter your first name" required />
        </div>

        <!-- Last Name -->
        <div class="form-group">
          <label for="lastName" class="form-label">Last Name</label>
          <input v-model="lastName" type="text" class="form-control" id="lastName" placeholder="Enter your last name" required />
        </div>

        <!-- Department -->
        <div class="form-group">
          <label for="department" class="form-label">Department</label>
          <input v-model="department" type="text" class="form-control" id="department" placeholder="Enter your department" required />
        </div>

        <!-- Profile Picture -->
        <div class="form-group">
          <label for="profilePic" class="form-label">Profile Picture</label>
          <input type="file" class="form-control" id="profilePic" @change="onFileChange" />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter your email" required />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter your password" required />
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password" required />
        </div>

        <button type="submit" class="btn btn-primary">Register</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      studentId: '',
      firstName: '',
      lastName: '',
      department: '',
      profilePic: null,
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    // Handle file input change
    onFileChange(event) {
      this.profilePic = event.target.files[0]; // Store the selected file
    },
    async registerUser() {
      // ตรวจสอบว่า password กับ confirm password ตรงกันหรือไม่
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      try {
        // ใช้ FormData สำหรับการส่งข้อมูลที่มีไฟล์
        const formData = new FormData();
        formData.append('studentId', this.studentId);
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('department', this.department);
        formData.append('profilePic', this.profilePic); // Append file to form data
        formData.append('email', this.email);
        formData.append('password', this.password);

        const response = await axios.post('http://localhost:3000/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // กำหนดให้เป็นแบบ multipart/form-data
          },
        });

        // หากการลงทะเบียนสำเร็จ, รีไดเรคไปหน้า Login
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error registering user';
      }
    },
  },
};
</script>

<style scoped>
/* การตั้งค่าสไตล์หลัก */
.register-container {
  background-color: #F9F7F7; /* พื้นหลังของหน้า */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* ทำให้ความสูงของหน้าเต็มหน้าจอ */
  margin: 0;
  padding: 0;
}

/* สไตล์สำหรับการ์ด Register */
.register-card {
  background-color: #DBE2EF; /* สีพื้นหลังของการ์ด */
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px; /* ขนาดกล่อง Register */
  text-align: center;
  box-sizing: border-box;
  min-height: 400px; /* ความสูงขั้นต่ำของการ์ด Register */
}

/* สไตล์สำหรับหัวข้อ Register */
.register-title {
  color: #3F72AF; /* สีหัวข้อ */
  font-size: 2rem;
  margin-bottom: 20px;
}

/* สไตล์สำหรับฟอร์ม */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  color: #112D4E; /* สีของข้อความ */
}

.form-control {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #3F72AF;
  width: 100%;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #112D4E; /* สีของกรอบเมื่อมีการคลิก */
  box-shadow: 0 0 5px rgba(17, 45, 78, 0.2);
}

/* สไตล์สำหรับปุ่ม Register */
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
  background-color: #112D4E; /* เมื่อ hover จะเปลี่ยนเป็นสีเข้ม */
}

/* สไตล์ข้อความผิดพลาด */
.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
}

/* สไตล์ลิงก์ Forgot Password */
.forgot-password-link {
  display: block;
  margin-top: 10px;
  color: #3F72AF;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password-link:hover {
  color: #112D4E;
}

/* ปรับให้รองรับการแสดงผลในมือถือ */
@media (max-width: 768px) {
  .register-card {
    padding: 20px;
    max-width: 90%; /* ลดขนาดกล่องลงในมือถือ */
  }

  .form-control {
    font-size: 0.9rem;
  }

  button {
    font-size: 1rem;
  }
}
</style>

