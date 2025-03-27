<template>
  <div class="container pt-4">
    <h1 class="text-primary text-center text-3xl">Addmin Dashboard</h1>
    <div class="flex justify-between items-center">
      <h2 class="title text-black flex gap-2 items-center text-3xl mb-0!">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-people-fill"
          viewBox="0 0 16 16">
          <path
            d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
        </svg>
        Student List
      </h2>
      <label class="input search-input outline-0">
        <svg class="h-[1em] text-black opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input v-model="search" type="search" class="grow text-black" placeholder="ค้นหา"
          @input="fetchStudents(search)" />
      </label>
    </div>
    <table class="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Last Name</th>
          <th>Student ID</th>
          <th>Department</th>
          <th>Advisor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.studentId">
          <td>{{ student.firstName }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.studentId }}</td>
          <td>{{ student.department }}</td>
          <td>{{ student.advisor }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { http } from '@/utils';

export default {
  data() {
    return {
      students: [],
      search: '',
    };
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents(search = '') {
      try {
        const response = await http.get('/student?search=' + search);
        if (response.status === 200) {
          this.students = response?.data?.data?.map((val) => ({
            studentId: val?.profile?.id,
            firstName: val?.profile?.firstName,
            lastName: val?.profile?.lastName,
            department: val?.profile?.department,
            advisor: '',
          }));
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }
  }
};
</script>

<style scoped>
.title {
  color: #4CAF50;
  /* โทนสีหลักที่ใช้ในหน้า login */
  margin-bottom: 20px;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.student-table th,
.student-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.student-table th {
  background-color: #4CAF50;
  /* สีเดียวกับ title */
  color: white;
}

.student-table tr:hover {
  background-color: #f1f1f1;
  /* ให้มีการเปลี่ยนสีพื้นหลังเมื่อชี้ */
}

.student-table td {
  color: #333;
}

.search-input {
  font-size: 16px;
  color: #333;

  &:hover {
    border-color: #4CAF50;
    transition: border-color 0.3s ease;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
