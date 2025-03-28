<script>
import { http } from '@/utils';

export default {
  data() {
    return {
      advisor: null,
      students: [],
      search: ''
    };
  },
  mounted() {
    this.fetchAdvisorStudents();
  },
  methods: {
    async fetchAdvisorStudents(search = '') {
      try {
        const response = await http.get('/assignment/advisor-students');
        if (response.status === 200) {
          this.advisor = response.data.advisor;
          this.students = this.advisor.students.filter(student =>
            this.matchesSearch(student, search)
          );
        }
      } catch (error) {
        console.error('Error fetching advisor students:', error);
      }
    },
    matchesSearch(student, search) {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        student.profile.firstName.toLowerCase().includes(searchLower) ||
        student.profile.lastName.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        student.profile.department.toLowerCase().includes(searchLower)
      );
    },
    formatProfilePic(student) {
      return student.profile.profilePic ||
        `https://ui-avatars.com/api/?name=${student.profile.firstName}+${student.profile.lastName}&background=4CAF50&color=fff`
    }
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student =>
        this.matchesSearch(student, this.search)
      );
    }
  }
}
</script>

<template>
  <div class="container pt-4 text-black">
    <h1 class="text-primary text-center text-3xl mb-6">รายชื่อนักศึกษาในความดูแล</h1>

    <div v-if="advisor" class="mb-6">
      <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-square"
          viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
        </svg>
        {{ advisor.profile.position }} {{ advisor.profile.firstName }} {{ advisor.profile.lastName }}
      </h2>
      <p class="text-gray-600 mt-2">ภาควิชา: {{ advisor.profile.department }}</p>
    </div>

    <div class="flex flex-col md:flex-row gap-2 justify-between items-center mb-4">
      <label class="input input-bordered flex items-center gap-2 w-full max-w-xs ms-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
          <path fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd" />
        </svg>
        <input v-model="search" type="text" class="grow" placeholder="ค้นหานักศึกษา..." />
      </label>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center">รูปโปรไฟล์</th>
            <th class="text-center">รหัสนักศึกษา</th>
            <th class="text-center">ชื่อ</th>
            <th class="text-center">นามสกุล</th>
            <th class="text-center">ภาควิชา</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in filteredStudents" :key="student.id">
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img :src="formatProfilePic(student)" :alt="student.profile.firstName" />
                </div>
              </div>
            </td>
            <td class="text-center">{{ student.profile.user.username }}</td>
            <td class="text-center">{{ student.profile.firstName }}</td>
            <td class="text-center">{{ student.profile.lastName }}</td>
            <td class="text-center">{{ student.profile.department }}</td>
            <td class="text-center">
              <RouterLink class="event-link btn btn-primary text-white! p-3!" :to="{ name: 'advisor-comment', params: { id: student.id } }">
                Comment
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredStudents.length === 0" class="text-center text-gray-500 mt-4">
        ไม่พบนักศึกษาในความดูแล
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #4CAF50;
}
</style>