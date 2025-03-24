<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
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
      errorMessage: '',
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);  // Save token to localStorage
        this.$router.push('/home'); // Redirect to home page after successful login
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Invalid credentials';
      }
    },
  },
};
</script>
