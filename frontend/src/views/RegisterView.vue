<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-title">Student Registration</h1>
      <form @submit.prevent="registerUser" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input
              v-model="firstName"
              type="text"
              class="form-control"
              id="firstName"
              placeholder="Enter first name"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              class="form-control"
              id="lastName"
              placeholder="Enter last name"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="studentId" class="form-label">Student ID</label>
          <input
            v-model="studentId"
            type="text"
            class="form-control"
            id="studentId"
            placeholder="Enter student ID"
            required
          />
        </div>

        <div class="form-group">
          <label for="department" class="form-label">Department</label>
          <input
            v-model="department"
            type="text"
            class="form-control"
            id="department"
            placeholder="Enter department"
            required
          />
        </div>



        <div class="form-group">
          <label for="profilePic" class="form-label">Profile Picture</label>
          <input
            type="file"
            class="form-control file-input"
            id="profilePic"
            @change="onFileChange"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-control"
              id="confirmPassword"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        <button type="submit" class="btn-register">Register</button>

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
    onFileChange(event) {
      this.profilePic = event.target.files[0];
    },
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      try {
        const formData = new FormData();
        formData.append('studentId', this.studentId);
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('department', this.department);
        formData.append('profilePic', this.profilePic);
        formData.append('email', this.email);
        formData.append('password', this.password);

        const response = await axios.post('http://localhost:3000/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error registering user';
      }
    },
  },
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.register-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.register-title {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  font-size: 1.8rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-control:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.btn-register {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #357abd;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .register-card {
    width: 90%;
    padding: 20px;
  }
}
</style>