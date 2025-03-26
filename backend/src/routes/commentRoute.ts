import express from 'express';
import * as commentController from '../controllers/commentController';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

// นักศึกษาสร้างcommentใหม่
router.post('/', authenticateJWT, authorizeRole(['student']), commentController.createCommend);

// นักศึกษาตอบกลับ
router.post('/student-reply', authenticateJWT, authorizeRole(['student']), commentController.studentReply);

// อาจารย์ตอบกลับ
router.post('/advisor-reply', authenticateJWT, authorizeRole(['advisor']), commentController.advisorReply);

// ดึงข้อความของนักศึกษา
router.get('/student', authenticateJWT, authorizeRole(['student']), commentController.getStudentConversations);

// ดึงข้อความของอาจารย์
router.get('/advisor', authenticateJWT, authorizeRole(['advisor']), commentController.getAdvisorConversations);

// ดึงข้อความของนักศึกษารายบุคล สำหรับอาจารย์
router.get('/conversation/:studentId', authenticateJWT, authorizeRole(['advisor']), commentController.getConversation);

export default router;