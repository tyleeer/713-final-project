<template>
  <div class="student-list-container">
    <h1 class="title">Student List</h1>
    <input v-model="search" type="text" placeholder="ค้นหา" class="search-input" @input="fetchStudents(search)" />
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
.student-list-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.title {
  text-align: center;
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
  width: 30%;
  padding: 5px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  color: #333;
  float: right;

  &:hover {
    border-color: #4CAF50;
    transition: border-color 0.3s ease;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>
