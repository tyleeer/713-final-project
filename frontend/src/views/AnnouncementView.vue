<script setup lang="ts">
import '../assets/daisy.css'
import { http } from '@/utils';
import { ref, onMounted, computed } from 'vue'
import type { Announcement } from '@/types';

const announcements = ref<Announcement[] | null>(null)
const errorMessage = ref<string | null>(null)
const isLoading = ref(true)

const fetchAnnouncements = async () => {
  try {
    const response = await http.get('/announcement')
    console.log('Full Response:', response) // Debug: Log full response
    console.log('Response Data:', response.data) // Debug: Log response data
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
  document.documentElement.setAttribute('data-theme', 'light')
  const response = await fetchAnnouncements()
  if (response) {
    // Ensure the data is an array
    announcements.value = Array.isArray(response.data)
      ? response.data
      : response.data.announcement || []
  }
})

const downloadFile = (fileUrl: string) => {
  const link = document.createElement('a')
  link.href = fileUrl
  link.target = '_blank'
  link.download = fileUrl.split('/').pop() || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="container mx-auto mt-10 p-4">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-black text-3xl">Announcements</h2>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Announcement Items -->
        <div v-else-if="announcements && announcements.length > 0">
          <div v-for="announcement in announcements" :key="announcement.id" class="border-b pb-4 mb-4">
            <div class="flex items-start space-x-4 gap-4">
              <!-- File Preview -->
              <div class="w-1/4">
                <div v-if="announcement.fileUrl" class="container">
                  <iframe :src="announcement.fileUrl" class="w-full h-48 object-cover rounded-lg"
                    title="File Preview" />
                </div>

                <!-- PDF Preview
                <div v-else-if="isPDF(announcement.file)"
                  class="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="ml-2">PDF Document</span>
                </div> -->

                <!-- Other File Types -->
                <!-- <div v-else class="bg-gray-100 p-4 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2h-9z" />
                  </svg>
                  <span class="ml-2">Other File</span>
                </div> -->
              </div>

              <!-- Announcement Details -->
              <div class="w-3/4">
                <h3 class="text-xl mb-2 text-black">{{ announcement.topic }}</h3>
                <p class="text-gray-600 mb-2">{{ announcement.content }}</p>

                <!-- Advisor Information -->
                <div class="text-sm text-gray-500 mb-2">
                  Posted by: {{ announcement.advisor.profile.firstName }} {{ announcement.advisor.profile.lastName }}
                </div>

                <!-- Timestamp -->
                <div class="text-sm text-gray-500 mb-2">
                  {{ new Date(announcement.createdAt).toLocaleString() }}
                </div>

                <!-- Download Button -->
                <div class="card-actions justify-end">
                  <button v-if="announcement.fileUrl" @click="downloadFile(announcement.fileUrl)"
                    class="btn btn-primary btn-sm">
                    Download File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Announcements Message -->
        <div v-else class="text-center text-gray-500">
          ไม่พบประกาศ
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  margin: 20px auto;
}
</style>