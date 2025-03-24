import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware'; // นำเข้า JWT Middleware

const router = express.Router();

// Route สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้
router.get('/profile', authenticateJWT, async (req: Request, res: Response) => {
  const user = req.user; // ข้อมูลผู้ใช้ที่ได้จาก JWT token

  // ทำการส่งข้อมูลโปรไฟล์กลับไปให้ผู้ใช้
  res.json({
    message: 'User profile data',
    user,
  });
});

export default router;
