<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-title">Academic Advisor Registration</h1>
      <form @submit.prevent="registerAdvisor" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input v-model="firstName" type="text" class="form-control" id="firstName" placeholder="Enter first name" required />
          </div>
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input v-model="lastName" type="text" class="form-control" id="lastName" placeholder="Enter last name" required />
          </div>
        </div>

        <div class="form-group">
          <label for="academicPosition" class="form-label">Academic Position</label>
          <select v-model="academicPosition" class="form-control" id="academicPosition" required>
            <option value="">Select Academic Position</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Professor">Professor</option>
          </select>
        </div>

        <div class="form-group">
          <label for="role" class="form-label">Role</label>
          <input v-model="role" type="text" class="form-control" id="role" value="Adviser" readonly />
        </div>

        <div class="form-group">
          <label for="profilePic" class="form-label">Profile Picture</label>
          <div class="file-input-wrapper">
            <input type="file" class="file-input" id="profilePic" @change="onFileChange" required />
            <span class="file-input-label">Choose File</span>
          </div>
          <p v-if="fileName" class="file-name">{{ fileName }}</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="password" placeholder="Enter password" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" placeholder="Confirm password" required />
          </div>
        </div>

        <button type="submit" class="btn-register">Register Advisor</button>

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
      firstName: '',
      lastName: '',
      academicPosition: '',
      profilePic: null,
      password: '',
      confirmPassword: '',
      role: 'Adviser',
      errorMessage: '',
      fileName: '',
    };
  },
  methods: {
    onFileChange(event) {
      this.profilePic = event.target.files[0];
      this.fileName = this.profilePic.name;
    },
    async registerAdvisor() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      const formData = new FormData();
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('academicPosition', this.academicPosition);
      formData.append('role', this.role);
      formData.append('profilePic', this.profilePic);
      formData.append('password', this.password);

      try {
        const response = await http.postForm('auth/register-advisor', formData);
        if (response.status === 201) {
          this.errorMessage = 'Advisor registered successfully';
          this.$router.push('/login');
        }
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error registering advisor';
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
  margin: 0;
  padding: 20px;
  background-color: #f4f6f9;
}

.register-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 500px;
}

.register-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
  font-weight: 600;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  margin-bottom: 8px;
  color: #34495e;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  color: #2c3e50;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.file-input-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.file-input-label {
  display: inline-block;
  padding: 12px 20px;
  background-color: #ecf0f1;
  color: #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.file-input-label:hover {
  background-color: #dfe4e6;
}

.file-name {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.btn-register {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-top: 15px;
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 20px;
  }

  .register-card {
    width: 100%;
    padding: 20px;
  }
}
</style>