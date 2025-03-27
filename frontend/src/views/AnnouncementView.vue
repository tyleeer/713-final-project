<script setup lang="ts">
import { http } from '@/utils';
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { Announcement } from '@/types/index';

const announcements = ref<Announcement[] | null>(null)
const errorMessage = ref<string | null>(null)
const isLoading = ref(true)
const checkAdvisor = ref(false)
const checkAdmin = ref(false)

const fetchAnnouncements = async () => {
  try {
    const response = await http.get('/announcement')
    return response;
  } catch (error: any) {
    console.error('Fetch Error:', error) // Debug: Log any errors
    errorMessage.value = error.response?.data?.message || 'Invalid credentials';
    window.location.href = '/login';
    return null;
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const role = localStorage.getItem("role");
  checkAdvisor.value = role?.toLowerCase() == "advisor";
  checkAdmin.value = role?.toLowerCase() == "admin";
  
  if (!checkAdmin.value) {
    const response = await fetchAnnouncements()
    if (response) {
      // Ensure the data is an array
      announcements.value = Array.isArray(response.data)
      ? response.data
      : response.data.announcement || []
    }
  }
})

const downloadFile = (fileUrl: string) => {
  const link = document.createElement('a')
  link.href = fileUrl
  link.target = "_blank"
  link.download = fileUrl.split('/').pop() || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="container p-4 flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <h2 class="card-title text-black text-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-megaphone"
          viewBox="0 0 16 16">
          <path
            d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
        </svg>
        Announcement
      </h2>
      <div v-if="announcements && announcements.length > 0 && checkAdvisor">
        <RouterLink :to="{ name: 'create-announcement' }" class="btn btn-primary text-white! px-3!"><svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle"
            viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          สร้างประกาศ
        </RouterLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Announcement Items -->
    <div v-else-if="announcements && announcements.length > 0" class="flex flex-col gap-4">
      <div v-for="announcement in announcements" :key="announcement.id"
        class="border-b pb-4 mb-4 card bg-base-100 shadow-xl">
        <div class="space-x-4 card-body flex-row gap-4">
          <!-- File Preview -->
          <div class="flex items-center">
            <div v-if="announcement.fileUrl" class="w-full">
              <!-- Other File Types -->
              <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-9z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Announcement Details -->
          <div class="flex-1">
            <h3 class="text-2xl font-semibold mb-2 text-black line-clamp-2">{{ announcement.topic }}</h3>
            <p class="text-gray-600 mb-2 line-clamp-2">{{ announcement.content }}</p>
            <!-- Advisor Information -->
            <p class="text-sm text-gray-500 mb-2">
              โดย: {{ announcement.advisor.profile.firstName }} {{ announcement.advisor.profile.lastName }}
            </p>

            <!-- Timestamp -->
            <div class="text-sm text-gray-500 mb-2">
              เมื่อ: {{ new Date(announcement.createdAt).toLocaleString() }}
            </div>

            <!-- Download Button -->
            <div class="card-actions justify-end absolute bottom-3 right-3 xl:bottom-6 xl:right-6">
              <button v-if="announcement.fileUrl" @click="downloadFile(announcement.fileUrl)"
                class="btn btn-primary btn-sm">
                เปิดไฟล์
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Announcements Message -->
    <div v-else class="text-2xl text-gray-500 flex flex-col items-center gap-2">
      <p>ไม่พบประกาศ</p>
      <div v-if="checkAdvisor">
        <RouterLink :to="{ name: 'create-announcement' }" class="btn btn-primary text-lg text-white! px-3!"><svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle"
            viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
          สร้างประกาศ
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  margin: 20px auto;
}
</style>
