<script setup lang="ts">
import { ref } from "vue";

const comments = ref<any[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const lastUpdated = ref<string>(new Date().toLocaleString());
const searchQuery = ref<string>("");
const currentUser = ref({
  id: "user-001",
  name: "Chalisa Wongsa",
  role: "Student",
  avatar: "",
});
const newComment = ref<string>("");
const attachedFiles = ref<File[]>([]);
const activeReplyForm = ref<string | null>(null);

const toggleReplyForm = (commentId: string) => {
  activeReplyForm.value = activeReplyForm.value === commentId ? null : commentId;
};

const cancelReply = () => {
  activeReplyForm.value = null;
};
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
      id: `comment-${Date.now()}`,
      author: { ...currentUser.value },
      content: newComment.value,
      createdAt: new Date().toISOString(),
      files: attachedFiles.value.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type || file.name.split(".").pop(),
        url: URL.createObjectURL(file),
      })),
      replies: [],
    };

    comments.value.unshift(newCommentData);
    newComment.value = "";
    attachedFiles.value = [];
  } catch (err) {
    error.value = "Failed to post the comment.";
  } finally {
    loading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    attachedFiles.value = [...attachedFiles.value, ...Array.from(files)];
  }
  (event.target as HTMLInputElement).value = ""; // Reset file input
};

const triggerFileInput = () => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1);
};

const postReply = (commentId: string) => {
  if (!replyContents.value[commentId]?.trim()) {
    error.value = "Reply content cannot be empty.";
    return;
  }

  const replyData = {
    id: `reply-${Date.now()}`,
    author: { ...currentUser.value },
    content: replyContents.value[commentId],
    time: new Date().toISOString(),
  };

  const comment = comments.value.find((c) => c.id === commentId);
  if (comment) {
    comment.replies.push(replyData);
  }

  replyContents.value[commentId] = "";
  activeReplyForm.value = null;
};

const formatTime = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

const formatFileSize = (bytes: number) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const getFileIcon = (file: { type: string }) => {
  if (file.type.includes("pdf")) return "pdf-icon";
  if (file.type.includes("word")) return "word-icon";
  if (file.type.includes("excel")) return "excel-icon";
  if (file.type.includes("powerpoint")) return "ppt-icon";
  if (file.type.includes("image")) return "image-icon";
  if (file.type.includes("zip") || file.type.includes("rar")) return "archive-icon";
  return "file-icon";
};
</script>

<template>
  <div class="discussion-container">
    <div class="discussion-header">
      <h2>Discussion Board</h2>
      <div class="discussion-stats">
        <span class="comment-count">{{ comments.length }} comments</span>
        <span class="separator">•</span>
        <span class="last-updated">Last updated: {{ lastUpdated }}</span>
      </div>
    </div>

    <div class="discussion-body">
      <!-- ฟอร์มโพสต์ความคิดเห็น -->
      <div class="post-comment-card">
        <div class="user-avatar">
          <img :src="currentUser.avatar" :alt="currentUser.name" v-if="currentUser.avatar">
          <div class="avatar-placeholder" v-else>{{ currentUser.name.charAt(0) }}</div>
        </div>
        <div class="comment-form">
          <div class="user-info">
            <span class="user-name">{{ currentUser.name }}</span>
            <span class="user-role">{{ currentUser.role }}</span>
          </div>
          <textarea v-model="newComment" placeholder="Write your comment here..."
            @keydown.enter.exact.prevent="postComment" @keydown.enter.shift.exact="newLine"></textarea>
          <div class="comment-actions">
            <button class="attach-file-btn" @click="triggerFileInput">
              <i class="fas fa-paperclip"></i> Attach File
            </button>
            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" multiple>
            <button class="post-btn" @click="postComment" :disabled="!newComment.trim() && !attachedFiles.length">
              Post Comment
            </button>
          </div>

          <!-- แสดงไฟล์ที่แนบมา -->
          <div class="attached-files" v-if="attachedFiles.length > 0">
            <div v-for="(file, index) in attachedFiles" :key="index" class="file-item">
              <span class="file-icon">
                <i :class="getFileIcon(file)"></i>
              </span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <button @click="removeFile(index)" class="remove-file-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- รายการความคิดเห็น -->
      <div class="comments-list">
        <div v-for="(comment, index) in comments" :key="comment.id" class="comment-card">
          <div class="comment-header">
            <div class="user-avatar">
              <img :src="comment.author.avatar" :alt="comment.author.name" v-if="comment.author.avatar">
              <div class="avatar-placeholder" v-else>{{ comment.author.name.charAt(0) }}</div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ comment.author.name }}</span>
              <span class="user-role">{{ comment.author.role }}</span>
              <span class="comment-time">{{ formatTime(comment.time) }}</span>
            </div>
          </div>

          <div class="comment-content">
            <p>{{ comment.content }}</p>

            <!-- แสดงไฟล์แนบ -->
            <div v-if="comment.files && comment.files.length > 0" class="comment-files">
              <div v-for="(file, fileIndex) in comment.files" :key="fileIndex" class="file-item">
                <a :href="file.url" target="_blank" class="file-link">
                  <i :class="getFileIcon(file)"></i>
                  <span>{{ file.name }}</span>
                </a>
              </div>
            </div>
          </div>

          <div class="comment-footer">
            <button class="reply-btn" @click="toggleReplyForm(comment.id)">
              <i class="fas fa-reply"></i> Reply
            </button>

            <!-- ฟอร์มตอบกลับ -->
            <div v-if="activeReplyForm === comment.id" class="reply-form">
              <textarea v-model="replyContents[comment.id]" placeholder="Write your reply..."></textarea>
              <div class="reply-actions">
                <button class="cancel-btn" @click="cancelReply">Cancel</button>
                <button class="post-btn" @click="postReply(comment.id)" :disabled="!replyContents[comment.id]?.trim()">
                  Post Reply
                </button>
              </div>
            </div>

            <!-- แสดงการตอบกลับ -->
            <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-card">
                <div class="reply-header">
                  <div class="user-avatar small">
                    <img :src="reply.author.avatar" :alt="reply.author.name" v-if="reply.author.avatar">
                    <div class="avatar-placeholder" v-else>{{ reply.author.name.charAt(0) }}</div>
                  </div>
                  <div class="user-info">
                    <span class="user-name">{{ reply.author.name }}</span>
                    <span class="user-role">{{ reply.author.role }}</span>
                    <span class="reply-time">{{ formatTime(reply.time) }}</span>
                  </div>
                </div>
                <div class="reply-content">
                  <p>{{ reply.content }}</p>
                </div>
              </div>
            </div>
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
