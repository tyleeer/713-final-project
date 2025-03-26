
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import CommentSystem from "@/components/CommentSystem.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <div class="student-chat-page">
    <CommentSystem
      user-role="student"
      :user-id="Number(user?.id) || 0"
    />
  </div>
</template>
