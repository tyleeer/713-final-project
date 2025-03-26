import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  studentId: number;
  advisorId: number;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  id: number;
  content: string;
  commentId: number;
  createdAt: string;
}

export const createComment = async (data: {
  studentId: number;
  advisorId: number;
  content: string;
}): Promise<Comment> => {
  const response = await axios.post('/api/comments', data);
  return response.data;
};

export const replyToComment = async (data: {
  commentId: number;
  content: string;
  studentId?: number;
  advisorId?: number;
}): Promise<Reply> => {
  const endpoint = data.studentId
    ? '/api/comments/student-reply'
    : '/api/comments/advisor-reply';

  const response = await axios.post(endpoint, data);
  return response.data;
};

export const getStudentComments = async (studentId: number): Promise<Comment[]> => {
  const response = await axios.get(`/api/comments/student/${studentId}`);
  return response.data;
};

export const getAdvisorComments = async (advisorId: number): Promise<Comment[]> => {
  const response = await axios.get(`/api/comments/advisor/${advisorId}`);
  return response.data;
};

export const getConversation = async (studentId: number, advisorId: number): Promise<Comment> => {
  const response = await axios.get(`/api/comments/conversation/${studentId}/${advisorId}`);
  return response.data;
};
