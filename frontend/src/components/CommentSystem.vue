<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Comment, Reply } from '../types';
import { getStudentComments, getAdvisorComments, replyToComment } from '@/services/CommentService';

const props = defineProps({
  userRole: {
    type: String as () => 'student' | 'advisor',
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
});

//เพิ่ม field ชั่วคราวสำหรับการทำงาน
type CommentWithTemp = Comment & {
  id?: number;
  replies?: Reply[];
};

const comments = ref<CommentWithTemp[]>([]);
const selectedComment = ref<CommentWithTemp | null>(null);
const newReply = ref('');

const loadComments = async () => {
  try {
    if (props.userRole === 'student') {
      // ระบุ type ว่าเป็น CommentWithTemp[]
      comments.value = await getStudentComments(props.userId) as CommentWithTemp[];
    } else {
      comments.value = await getAdvisorComments(props.userId) as CommentWithTemp[];
    }

    if (comments.value.length > 0) {
      selectedComment.value = comments.value[0];
    }
  } catch (error) {
    console.error('Error loading comments:', error);
  }
};

const selectComment = (comment: CommentWithTemp) => {
  selectedComment.value = comment;
};

const sendReply = async () => {
  if (!selectedComment.value?.id || !newReply.value.trim()) return;

  try {
    await replyToComment({
      commentId: selectedComment.value.id, // ใช้ type assertion ตรงนี้
      content: newReply.value,
      [props.userRole === 'student' ? 'studentId' : 'advisorId']: props.userId
    });

    newReply.value = '';
    await loadComments();
  } catch (error) {
    console.error('Error sending reply:', error);
  }
};

onMounted(loadComments);

</script>

<template>
  <div class="comment-system">
    <div class="comment-list">

      <div
        v-for="(comment, index) in comments"
        :key="index"
        @click="selectComment(comment)"
        class="comment-item"
      >
        <p>{{ comment.content }}</p>
        <small>
          {{ userRole === 'student' ? 'to Adivisor' : 'to Student' }}
        </small>
      </div>
    </div>

    <div class="conversation" v-if="selectedComment">
      <div class="original-comment">
        <p>{{ selectedComment.content }}</p>
        <small>Message</small>
      </div>

      <!-- ตรวจสอบ replies ก่อนแสดงผล -->
      <template v-if="selectedComment.replies">
        <div
          v-for="(reply, replyIndex) in selectedComment.replies"
          :key="replyIndex"
          class="reply"
        >
          <p>{{ reply.content }}</p>
          <small>Answer</small>
        </div>
      </template>

      <div class="reply-box">
        <textarea
          v-model="newReply"
          placeholder="Add message"
        ></textarea>
        <button @click="sendReply">Send</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-system {
  display: flex;
  gap: 20px;
  height: 70vh;
}

.comment-list {
  width: 300px;
  border-right: 1px solid #eee;
  padding-right: 15px;
  overflow-y: auto;
}

.comment-item {
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.comment-item:hover {
  background-color: #f9f9f9;
}

.conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.original-comment {
  background-color: #f0f7ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.reply {
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.reply-box {
  margin-top: auto;
  padding-top: 15px;
}

.reply-box textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.reply-box button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
