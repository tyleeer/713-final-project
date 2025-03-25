import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticate, studentOnly, advisorOnly } from '../middlewares/authMiddleware';

const router = express.Router();

// นักศึกษาสร้างcommentใหม่
router.post('/', authenticate, studentOnly, commentController.createCommend);

// นักศึกษาตอบกลับ
router.post('/student-reply', authenticate, studentOnly, commentController.studentReply);

// อาจารย์ตอบกลับ
router.post('/advisor-reply', authenticate, advisorOnly, commentController.advisorReply);

// ดึงข้อความของนักศึกษา
router.get('/student', authenticate, studentOnly, commentController.getStudentConversations);

// ดึงข้อความของอาจารย์
router.get('/advisor', authenticate, advisorOnly, commentController.getAdvisorConversations);

// ดึงข้อความของนักศึกษารายบุคล สำหรับอาจารย์
router.get('/conversation/:studentId', authenticate, advisorOnly, commentController.getConversation);

export default router;