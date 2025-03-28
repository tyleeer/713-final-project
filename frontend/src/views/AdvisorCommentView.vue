<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { http } from '@/utils';

const studentProps = defineProps<{
  id: string
}>()

const comments = ref<any[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const lastUpdated = ref<string>(new Date().toLocaleString());
const searchQuery = ref<string>("");
const currentUser = ref({
  id: "",
  name: "",
  role: "",
  avatar: "",
});
const newComment = ref<string>("");
const attachedFiles = ref<File[]>([]);
const replyContents = ref<Record<string, string>>({});

// Methods
const newLine = () => {
  const textarea = document.activeElement as HTMLTextAreaElement;
  if (textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 1;
    newComment.value = textarea.value;
  }
};

const postComment = async () => {
  if (!newComment.value.trim() && attachedFiles.value.length === 0) {
    error.value = "Please enter a comment or attach a file.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const newCommentData = {
      content: newComment.value,
      studentId: studentProps.id
    };

    const response = await http.post('/comment/advisor', newCommentData)
    if (response.status == 201) {
      newComment.value = "";
      fetchComment()
    } else {
      throw new Error(response.data);
    }
  } catch (err) {
    error.value = "Failed to post the comment.";
  } finally {
    loading.value = false;
  }
};

const postReply = async (commentId: string) => {
  if (!replyContents.value[commentId]?.trim()) {
    error.value = "Reply content cannot be empty.";
    return;
  }
  try {
    const newReplyData = {
      commentId,
      content: replyContents.value[commentId]
    }

    const response = await http.post('/comment/advisor-reply', newReplyData)
    if (response.status == 201) {
      replyContents.value[commentId] = "";
      await fetchComment()
    } else {
      throw new Error(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const formatTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23", // Ensures 24-hour format
    timeZone: "Asia/Bangkok"
  };
  return new Date(date).toLocaleString("en-US", options); // Change to "th-TH" if needed
};

const fetchProfile = async () => {
  try {
    const response = await http.get('/profile')
    if (response.status == 200) {
      const userProfile = response.data;
      currentUser.value = {
        id: userProfile.id,
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        role: userProfile.position,
        avatar: userProfile.profilePic,
      }
    }
  } catch (error) {
    console.error('Fetch Error:', error)
  }
}

const fetchComment = async () => {
  try {
    const response = await http.get(`/comment/advisor?studentId=${studentProps.id}`,)
    if (response.status == 200) {
      comments.value = response.data;
      console.log("response.data: ", response.data);
    }
  } catch (error) {
    console.error('Fetch Error:', error)
  }
}

onMounted(() => {
  fetchProfile();
  fetchComment();
})
</script>

<template>
  <div class="discussion-container container mt-5">
    <div class="discussion-header bg-white!">
      <h2>Discussion Board</h2>
      <div class="discussion-stats">
        <span class="last-updated">Last updated: {{ lastUpdated }}</span>
      </div>
    </div>

    <div class="discussion-body">
      <!-- รายการความคิดเห็น -->
      <div class="comments-list mt-0!">
        <div v-if="comments && comments.length > 0" v-for="(comment, index) in comments" :key="comment.id"
          class="comment-card">
          <div v-if="comment.author == 'student'" class="comment-header mb-0!">
            <div class="user-avatar">
              <img :src="comment.student.profile.profilePic" :alt="comment.student.profile.profilePic"
                v-if="comment.student.profile.profilePic">
              <div class="avatar-placeholder" v-else>{{ comment.student.profile.firstName.charAt(0) }}</div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ `${comment.student.profile.firstName} ${comment.student.profile.lastName}`
                }}</span>
              <span class="user-role mr-2">{{ comment.author }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
          </div>

          <div v-if="comment.author == 'advisor'" class="comment-header mb-0!">
            <div class="user-avatar">
              <img :src="currentUser.avatar" :alt="currentUser.name"
                v-if="currentUser.avatar">
              <div class="avatar-placeholder" v-else>{{ currentUser.name.charAt(0) }}</div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ currentUser.name }}</span>
              <span class="user-role mr-2">{{ comment.author }}</span>
              <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
            </div>
          </div>

          <div class="comment-content text-gray-700">
            <p>{{ comment.content }}</p>
          </div>

          <div class="comment-footer">
            <p class="flex gap-1 items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-reply"
                viewBox="0 0 16 16">
                <path
                  d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.7 8.7 0 0 0-1.921-.306 7 7 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254l-.042-.028a.147.147 0 0 1 0-.252l.042-.028zM7.8 10.386q.103 0 .223.006c.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96z" />
              </svg> Reply
            </p>

            <!-- แสดงการตอบกลับ -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-card">
                <div v-if="reply.author == 'advisor'" class="reply-header">
                  <div class="user-avatar small">
                    <img :src="currentUser.avatar" :alt="currentUser.name" v-if="currentUser.avatar">
                    <div class="avatar-placeholder" v-else>{{ currentUser.name.charAt(0) }}</div>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ currentUser.name }}</span>
                    <span class="user-role mr-2">{{ reply.author }}</span>
                    <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                  </div>
                </div>

                <div v-if="reply.author == 'student'" class="reply-header">
                  <div class="user-avatar small">
                    <img :src="comment.student.profile.profilePic" :alt="comment.student.profile.firstName" v-if="comment.student.profile.profilePic">
                    <div class="avatar-placeholder" v-else>{{ comment.student.profile.firstName.charAt(0) }}</div>
                  </div>
                  <div class="user-info">
                    <span class="user-role mr-2">{{ reply.author }}</span>
                    <span class="user-name">{{ comment.student.profile.firstName }}</span>
                    <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                  </div>
                </div>
                <div class="reply-content text-gray-700">
                  <p>{{ reply.content }}</p>
                </div>
              </div>
            </div>

            <!-- ฟอร์มตอบกลับ -->
            <div v-if="comments && comments.length > 0" class="reply-form text-gray-700 mt-8!">
              <textarea v-model="replyContents[comment.id]" placeholder="Write your reply..."></textarea>
              <div class="reply-actions">
                <button class="post-btn" @click="postReply(comment.id)" :disabled="!replyContents[comment.id]?.trim()">
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ฟอร์มโพสต์ความคิดเห็น -->
      <div v-if="comments && comments.length == 0" class="post-comment-card p-5">
        <div class="user-avatar">
          <img :src="currentUser.avatar" :alt="currentUser.name" v-if="currentUser.avatar">
          <div class="avatar-placeholder" v-else>{{ currentUser.name.charAt(0) }}</div>
        </div>
        <div class="comment-form">
          <div class="user-info">
            <span class="user-name">{{ currentUser.name }}</span>
            <span class="user-role">advisor</span>
          </div>
          <textarea v-model="newComment" class="text-gray-700" placeholder="Write your comment here..."
            @keydown.enter.exact.prevent="postComment" @keydown.enter.shift.exact="newLine"></textarea>
          <div class="comment-actions float-right">
            <button class="post-btn" @click="postComment" :disabled="!newComment.trim() && !attachedFiles.length">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* สไตล์สำหรับส่วน Discussion */


.discussion-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
}

.discussion-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.discussion-stats {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  color: #6c757d;
}

.comment-count {
  font-weight: 500;
}

.separator {
  margin: 0 8px;
}

.discussion-body {
  padding: 20px;
}

.post-comment-card {
  display: flex;
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eee;
  overflow: hidden;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.user-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.comment-form {
  flex-grow: 1;
}

.user-info {
  margin-bottom: 10px;
}

.user-name {
  font-weight: 600;
  margin-right: 8px;
  color: #2c3e50;
}

.user-role {
  font-size: 13px;
  color: #6c757d;
  background-color: #f1f1f1;
  padding: 2px 6px;
  border-radius: 4px;
}

.comment-form textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.attach-file-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.attach-file-btn:hover {
  color: #4285f4;
}

.attach-file-btn i {
  margin-right: 5px;
}

.post-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-btn:hover {
  background-color: #3367d6;
}

.post-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.attached-files {
  margin-top: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 14px;
}

.file-icon {
  margin-right: 8px;
  color: #6c757d;
  width: 20px;
  text-align: center;
}

.file-name {
  flex: 1;
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #6c757d;
  margin-right: 8px;
  font-size: 12px;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0 5px;
}

.comments-list {
  margin-top: 20px;
}

.comment-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
}

.comment-header {
  display: flex;
  margin-bottom: 15px;
}

.comment-time {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

.comment-content {
  margin-left: 65px;
  margin-bottom: 15px;
}

.comment-content p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
}

.comment-files {
  margin-top: 10px;
}

.file-link {
  display: flex;
  align-items: center;
  color: #4285f4;
  text-decoration: none;
  margin-bottom: 5px;
  font-size: 14px;
}

.file-link:hover {
  text-decoration: underline;
}

.file-link i {
  margin-right: 8px;
  font-size: 16px;
}

.comment-footer {
  margin-left: 65px;
}

.reply-btn {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.reply-btn:hover {
  color: #4285f4;
}

.reply-btn i {
  margin-right: 5px;
}

.reply-form {
  margin-top: 15px;
  margin-bottom: 15px;
}

.reply-form textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 10px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  background: none;
  border: none;
  color: #6c757d;
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  color: #dc3545;
}

.replies-list {
  margin-top: 20px;
  padding-left: 20px;
  border-left: 3px solid #eee;
}

.reply-card {
  margin-bottom: 15px;
}

.reply-header {
  display: flex;
  margin-bottom: 10px;
}

.reply-content {
  margin-left: 55px;
}

.reply-content p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
}

.reply-time {
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
}

/* ไอคอนไฟล์ประเภทต่างๆ */
.pdf-icon {
  color: #db4437;
}

.word-icon {
  color: #2b579a;
}

.excel-icon {
  color: #217346;
}

.ppt-icon {
  color: #d24726;
}

.image-icon {
  color: #f4b400;
}

.archive-icon {
  color: #ff6d00;
}

.file-icon {
  color: #6c757d;
}
</style>
