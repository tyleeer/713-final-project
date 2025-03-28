<template>
  <div class="advisor-summary-page">
    <h1 class="title">หน้าสรุปอาจารย์ที่ปรึกษา</h1>

    <!-- ตารางแสดงข้อมูลอาจารย์ -->
    <table class="advisor-table">
      <thead>
        <tr>
          <th>ชื่ออาจารย์</th>
          <th>จำนวนลูกศิษย์</th>
          <th>สรุปการนัดหมาย</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="advisor in advisors" :key="advisor.id">
          <td>{{ advisor.firstName }} {{ advisor.lastName }}</td>
          <td>{{ advisor.studentsCount }}</td>
          <td>
            <button class="btn-appointments" @click="viewAppointments(advisor.id)">ดูการนัดหมาย</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" class="pagination-btn">Prev</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages" class="pagination-btn">Next</button>
    </div>

    <!-- การแสดงการนัดหมาย -->
    <div v-if="appointments.length > 0" class="appointments-summary">
      <h2>การนัดหมาย</h2>
      <ul>
        <li v-for="appointment in appointments" :key="appointment.id" class="appointment-item">
          {{ appointment.student.name }} - <span :class="getAppointmentStatusClass(appointment.status)">{{ appointment.status }}</span> (นัดเมื่อ: {{ appointment.date }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      advisors: [], // รายชื่ออาจารย์
      appointments: [], // การนัดหมาย
      currentPage: 1, // หน้าปัจจุบัน
      totalPages: 1, // จำนวนหน้าทั้งหมด
      itemsPerPage: 5, // จำนวนรายการต่อหน้า
      search: '', // คำค้นหาของอาจารย์
    };
  },
  mounted() {
    this.fetchAdvisors();
  },
  methods: {
    // ดึงข้อมูลอาจารย์จาก API
    async fetchAdvisors() {
      try {
        const response = await axios.get(`/api/advisors?page=${this.currentPage}&limit=${this.itemsPerPage}&search=${this.search}`);
        this.advisors = response.data.advisors;
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error('Error fetching advisors:', error);
      }
    },

    // ฟังก์ชันแสดงการนัดหมายของอาจารย์
    async viewAppointments(advisorId) {
      try {
        const response = await axios.get(`/api/appointments?advisorId=${advisorId}`);
        this.appointments = response.data.appointments;
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    },

    // การเปลี่ยนหน้า (Pagination)
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchAdvisors();
      }
    },

    // การตั้งค่าสถานะของการนัดหมาย
    getAppointmentStatusClass(status) {
      if (status === 'Pending') {
        return 'status-pending';
      } else if (status === 'Confirmed') {
        return 'status-confirmed';
      } else if (status === 'Completed') {
        return 'status-completed';
      }
      return '';
    }
  },
};
</script>

<style scoped>
/* สไตล์ของหน้าสรุป */
.advisor-summary-page {
  padding: 20px;
  background-color: #f4f7fa;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 30px;
}

.advisor-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
}

.advisor-table th,
.advisor-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.advisor-table th {
  background-color: #4CAF50;
  color: #fff;
  font-size: 1.1rem;
}

.advisor-table td {
  font-size: 1rem;
  color: #333;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  transition: background-color 0.3s ease;
}

.pagination-btn:hover {
  background-color: #45a049;
}

.page-info {
  font-size: 1.1rem;
  color: #333;
  margin: 0 10px;
}

.appointments-summary {
  margin-top: 30px;
}

.appointment-item {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;
}

.status-pending {
  color: orange;
}

.status-confirmed {
  color: green;
}

.status-completed {
  color: gray;
}
</style>
