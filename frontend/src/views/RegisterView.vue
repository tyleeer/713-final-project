<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/register', {
          email: this.email,
          password: this.password,
        });
        this.$router.push('/login'); // Redirect to login page after successful registration
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error registering user';
      }
    },
  },
};
</script>
