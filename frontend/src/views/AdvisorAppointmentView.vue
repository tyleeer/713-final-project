<template>
  <div class="appointment-management">
    <div class="header">
      <h2>ระบบจัดการนัดหมาย</h2>
    </div>

    <div class="tabs">
      <button
        @click="activeTab = 'requests'"
        :class="{ active: activeTab === 'requests' }"
      >
        คำร้องขอนัดหมาย
        <span class="badge" v-if="pendingRequests.length > 0">
          {{ pendingRequests.length }}
        </span>
      </button>
      <button
        @click="activeTab = 'confirmed'"
        :class="{ active: activeTab === 'confirmed' }"
      >
        นัดหมายที่ยืนยันแล้ว
      </button>
    </div>

    <!-- คำร้องขอนัดหมายจากนักศึกษา -->
    <div v-if="activeTab === 'requests'" class="request-list">
      <div v-if="pendingRequests.length === 0" class="empty-state">
        <p>ไม่มีคำร้องขอนัดหมายใหม่</p>
      </div>

      <div v-for="request in pendingRequests" :key="request.id" class="request-card">
        <div class="student-info">
          <div class="avatar">{{ request.student.name.charAt(0) }}</div>
          <div>
            <h4>{{ request.student.name }}</h4>
            <p class="student-id">{{ request.student.id }}</p>
          </div>
        </div>

        <div class="request-details">
          <p><strong>หัวข้อ:</strong> {{ request.topic }}</p>
          <p><strong>วันที่ขอ:</strong> {{ formatDate(request.requestedDate) }}</p>
          <p><strong>รายละเอียด:</strong> {{ request.description }}</p>
        </div>

        <div class="action-buttons">
          <button @click="openProposeModal(request)" class="btn-propose">
            <i class="fas fa-calendar-alt"></i> เสนอวันนัดหมาย
          </button>
          <button @click="rejectRequest(request.id)" class="btn-reject">
            <i class="fas fa-times"></i> ปฏิเสธ
          </button>
        </div>
      </div>
    </div>

    <!-- นัดหมายที่ยืนยันแล้ว -->
    <div v-if="activeTab === 'confirmed'" class="confirmed-list">
      <div v-if="confirmedAppointments.length === 0" class="empty-state">
        <p>ไม่มีนัดหมายที่ยืนยันแล้ว</p>
      </div>

      <div v-for="appointment in confirmedAppointments" :key="appointment.id" class="appointment-card">
        <div class="appointment-header">
          <div class="student-info">
            <div class="avatar">{{ appointment.student.name.charAt(0) }}</div>
            <div>
              <h4>{{ appointment.student.name }}</h4>
              <p class="student-id">{{ appointment.student.id }}</p>
            </div>
          </div>
          <div class="appointment-time">
            <i class="fas fa-clock"></i>
            {{ formatDateTime(appointment.appointmentTime) }}
          </div>
        </div>

        <div class="appointment-details">
          <p><strong>หัวข้อ:</strong> {{ appointment.topic }}</p>
          <p><strong>สถานะ:</strong>
            <span :class="appointment.status">{{ appointment.status }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal เสนอวันนัดหมาย -->
    <div v-if="showProposeModal" class="modal-overlay">
      <div class="modal-content">
        <h3>เสนอวันนัดหมาย</h3>
        <p>นักศึกษา: {{ selectedRequest.student.name }}</p>

        <div class="form-group">
          <label>วันที่นัดหมาย:</label>
          <input type="date" v-model="proposedDate" :min="today">
        </div>

        <div class="form-group">
          <label>เวลา:</label>
          <select v-model="proposedTime">
            <option v-for="time in availableTimes" :value="time" :key="time">
              {{ time }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <button @click="proposeAppointment" class="btn-confirm">
            <i class="fas fa-check"></i> ยืนยัน
          </button>
          <button @click="closeModal" class="btn-cancel">
            <i class="fas fa-times"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser: {
        id: 't001',
        name: 'อาจารย์สมชาย',
        role: 'teacher'
      },
      activeTab: 'requests',
      pendingRequests: [
        {
          id: 'req001',
          student: { id: 's001', name: 'นางสาวชาลิสา วงศ์ษา' },
          topic: 'ปรึกษาโครงงาน',
          requestedDate: '2023-06-15',
          description: 'ต้องการปรึกษาเกี่ยวกับหัวข้อโครงงานครั้งที่ 2'
        },
        {
          id: 'req002',
          student: { id: 's002', name: 'นายวรรณเกียรติ อินทร' },
          topic: 'ปัญหาการบ้าน',
          requestedDate: '2023-06-16',
          description: 'มีข้อสงสัยเกี่ยวกับการบ้านบทที่ 5'
        }
      ],
      confirmedAppointments: [
        {
          id: 'app001',
          student: { id: 's003', name: 'นายปานนที ธรรมรักษ์' },
          topic: 'สอบถามเรื่องฝึกงาน',
          appointmentTime: '2023-06-10T13:30:00',
          status: 'confirmed'
        }
      ],
      showProposeModal: false,
      selectedRequest: null,
      proposedDate: '',
      proposedTime: '09:00',
      availableTimes: ['09:00', '10:30', '13:00', '14:30', '16:00'],
      today: new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    openProposeModal(request) {
      this.selectedRequest = request
      this.proposedDate = request.requestedDate
      this.showProposeModal = true
    },
    closeModal() {
      this.showProposeModal = false
    },
    proposeAppointment() {
      const appointmentTime = `${this.proposedDate}T${this.proposedTime}:00`

      // ในสภาพแวดล้อมจริงควรเรียก API เพื่อบันทึกข้อมูล
      this.confirmedAppointments.push({
        id: `app${Date.now()}`,
        student: this.selectedRequest.student,
        topic: this.selectedRequest.topic,
        appointmentTime,
        status: 'pending confirmation'
      })

      // ลบคำขอออกจากรายการ pending
      this.pendingRequests = this.pendingRequests.filter(
        req => req.id !== this.selectedRequest.id
      )

      this.closeModal()
    },
    rejectRequest(requestId) {
      // ในสภาพแวดล้อมจริงควรเรียก API เพื่ออัปเดตสถานะ
      this.pendingRequests = this.pendingRequests.filter(
        req => req.id !== requestId
      )
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('th-TH', options)
    },
    formatDateTime(dateTimeString) {
      const date = new Date(dateTimeString)
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
      const timeOptions = { hour: '2-digit', minute: '2-digit' }
      return `${date.toLocaleDateString('th-TH', dateOptions)} เวลา ${date.toLocaleTimeString('th-TH', timeOptions)}`
    }
  }
}
</script>

<style scoped>
.appointment-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
}

.tabs button.active {
  border-bottom: 2px solid #4285f4;
  color: #4285f4;
}

.tabs .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #f44336;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.request-card, .appointment-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 15px;
}

.student-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #4285f4;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
}

.student-id {
  color: #666;
  font-size: 14px;
}

.request-details p, .appointment-details p {
  margin: 5px 0;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
}

.btn-propose {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.appointment-time {
  background-color: #f5f5f5;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
}

.status.confirmed {
  color: #4caf50;
}

.status.pending {
  color: #ff9800;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.btn-confirm {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
