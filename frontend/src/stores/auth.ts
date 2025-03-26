import { defineStore } from 'pinia';
import axios from 'axios';

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  studentId?: string;
  department?: string;
}

interface User {
  id: number;
  role: 'student' | 'advisor';
  profile: Profile;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      const response = await axios.post('/api/auth/login', credentials);
      this.user = response.data;
    },
    logout() {
      this.user = null;
    }
  }
});
