<script>
import { http } from '@/utils';

export default {
  data() {
    return {
      students: [],
      advisors: [],
      search: '',
      checkAdmin: false,
      selectedStudent: null,
      selectedAdvisor: null
    };
  },
  mounted() {
    const role = localStorage.getItem("role");
    this.checkAdmin = role?.toLowerCase() == "admin";
    if(this.checkAdmin) {
      this.fetchStudents();
      this.fetchAdvisors();
    }
  },
  methods: {
    async fetchStudents(search = '') {
      try {
        const response = await http.get('/student?search=' + search);
        if (response.status === 200) {
          this.students = response?.data?.data?.map((val) => ({
            id: val?.profile?.id,
            firstName: val?.profile?.firstName,
            lastName: val?.profile?.lastName,
            department: val?.profile?.department,
            advisor: '',
            username: val?.username,
            profilePic: val?.profile?.profilePic,
            advisor: val?.profile?.Student?.advisor ? 
            `${val?.profile?.Student?.advisor?.profile?.firstName} ${val?.profile?.Student?.advisor?.profile?.lastName}` 
            : "-"
          }));
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    async fetchAdvisors() {
      try {
        const response = await http.get('/advisor');
        if (response.status === 200) {
          this.advisors = response?.data?.advisor;
          console.log("response?.data?.advisor: ", response?.data?.advisor)
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    openAdvisorModal(student) {
      this.selectedStudent = student;
      this.selectedAdvisor = null;
      advisorModal.showModal();
    },
    async saveAdvisor() {
      if (!this.selectedStudent || !this.selectedAdvisor) {
        alert('Please select a student and an advisor');
        return;
      }

      try {
        const response = await http.put(`/student/${this.selectedStudent.id}/advisor`, {
          advisorId: this.selectedAdvisor
        });

        if (response.status === 200) {
          // Update the local students list
          const studentIndex = this.students.findIndex(s => s.id === this.selectedStudent.id);
          if (studentIndex !== -1) {
            const selectedAdvisorObj = this.advisors.find(a => a.id === this.selectedAdvisor);
            if (selectedAdvisorObj) {
              this.students[studentIndex].advisor =
                `${selectedAdvisorObj.profile.firstName} ${selectedAdvisorObj.profile.lastName}`;
            }
          }

          // Close the modal
          advisorModal.close();

          alert('Advisor assigned successfully');
        }
      } catch (error) {
        console.error('Error assigning advisor:', error);
        alert('Failed to assign advisor');
      }
    }
  }
};
</script>

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
        <input v-model="search" type="search" class="grow text-black" placeholder="ค้นหานักศึกษา..."
          @input="fetchStudents(search)" />
      </label>
    </div>
    <table class="student-table">
      <thead>
        <tr>
          <th class="text-center!">#</th>
          <th class="text-center!"></th>
          <th class="text-center!">Name</th>
          <th class="text-center!">Last Name</th>
          <th class="text-center!">Student ID</th>
          <th class="text-center!">Department</th>
          <th class="text-center!">Advisor</th>
          <th class="text-center!"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.studentId">
          <td>{{ student.id }}</td>
          <td class="text-center!">
            <div v-if="!student.profilePic" class="avatar avatar-placeholder">
              <div class="bg-neutral text-neutral-content w-12 rounded-full">
                <span class="text-xl">{{ `${student.firstName}`.charAt(0) }}</span>
              </div>
            </div>
            <div v-if="student.profilePic" class="avatar">
              <div class="w-12 rounded-full">
                <img :src="student.profilePic" />
              </div>
            </div>
          </td>
          <td>{{ student.firstName }}</td>
          <td>{{ student.lastName }}</td>
          <td>{{ student.username }}</td>
          <td>{{ student.department }}</td>
          <td>{{ student.advisor }}</td>
          <td class="text-center!">
            <button class="btn btn-primary" onclick="advisorModal.showModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path
                  d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <dialog id="advisorModal" class="modal modal-bottom sm:modal-middle text-black">
    <div class="modal-box">
      <h3 class="text-xl font-bold">โปรดเลือกอาจาย์ที่ปรึกษา</h3>
      <fieldset v-if="advisors.length > 0" class="fieldset">
        <legend class="fieldset-legend text-lg">รายชื่อาจารย์</legend>
        <select class="select w-full">
          <option disabled selected>โปรดเลือก</option>
          <option v-for="advisor in advisors" :key="advisor.id" :value="advisor.id">
            {{ `${advisor.profile.firstName} ${advisor.profile.lastName}` }}
          </option>
        </select>
      </fieldset>
      <p v-if="advisors.length == 0" class="py-4 text-center">ไม่พบอาจารย์ที่ปรึกษา</p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-success mr-2">บันทึก</button>
          <button class="btn">ยกเลิก</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

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
