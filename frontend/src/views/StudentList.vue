<template>
  <div class="student-list-container">
    <h1 class="title">Student List</h1>
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
export default {
  data() {
    return {
      students: []
    };
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await fetch('/api/students');
        this.students = await response.json();
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
  color: #4CAF50; /* โทนสีหลักที่ใช้ในหน้า login */
  margin-bottom: 20px;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.student-table th, .student-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.student-table th {
  background-color: #4CAF50; /* สีเดียวกับ title */
  color: white;
}

.student-table tr:hover {
  background-color: #f1f1f1; /* ให้มีการเปลี่ยนสีพื้นหลังเมื่อชี้ */
}

.student-table td {
  color: #333;
}
</style>
