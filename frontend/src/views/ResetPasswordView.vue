<template>
  <div class="reset-password">
    <h1>Reset Password</h1>
    <form @submit.prevent="resetPassword">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="newPassword" type="password" placeholder="New Password" required />
      <button type="submit">Reset Password</button>
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
      newPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async resetPassword() {
      try {
        await axios.post('http://localhost:3000/reset-password', {
          email: this.email,
          newPassword: this.newPassword,
        });
        this.$router.push('/login'); // Redirect to login page after password reset
      } catch (error) {
        this.errorMessage = error.response.data.message || 'Error resetting password';
      }
    },
  },
};
</script>
