<script>
import { http } from '@/utils';
export default {
  data() {
    return {
      file: null,
      topic: '',
      content: '',
      errorMessage: ''
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async createAnnouncement() {
      const formData = new FormData();

      formData.append('topic', this.topic);
      formData.append('content', this.content);

      if (this.file) {
        formData.append('file', this.file);
      }

      try {
        const response = await http.postForm('/advisor/announcement', formData);

        if (response.status === 201) {
          this.errorMessage = 'Announcement published successfully';
          this.$router.push('/');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Error creating announcement';
      }
    },
  },
};
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="register-title">Publishing Announcement</h1>
      <form @submit.prevent="createAnnouncement" class="register-form">
        <div class="form-group">
          <label for="topic" class="form-label">Topic <span class="text-error">*</span></label>
          <input v-model="topic" type="text" class="form-control" id="topic" placeholder="Enter topic" required />
        </div>
        <div class="form-group">
          <label for="content" class="form-label">Content <span class="text-error">*</span></label>
          <textarea v-model="content" class="form-control" id="content" placeholder="Enter content" required />
        </div>

        <div class="form-group">
          <label for="file" class="form-label">Additional file</label>
          <input type="file" class="form-control file-input" id="file" @change="onFileChange" />
        </div>

        <button type="submit" class="btn-register">Publish</button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  overflow: scroll;
}

.register-card {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
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
  color: #555;
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


.file-name {
  font-size: 0.9rem;
  color: #333;
}

.file-input {
  background-color: white;
  height: 60px;
  --btn-color: lightgray;
}

textarea {
  min-height: 150px;
}

@media (max-width: 480px) {
  .register-card {
    width: 90%;
    padding: 20px;
  }
}
</style>