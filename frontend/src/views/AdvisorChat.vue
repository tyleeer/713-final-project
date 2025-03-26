<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import CommentSystem from "@/components/CommentSystem.vue";

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>
<template>
  <div class="advisor-chat-page">
    <CommentSystem
      user-role="advisor"
      :user-id="Number(user?.id) || 0"
    />
  </div>
</template>




