import express, { Response, Request } from 'express';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware'; // นำเข้า JWT Middleware
import { getStudent } from '../services/studentService'

const router: express.Router = express.Router()

// Route สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้
router.get('/profile', authenticateJWT, async (req: any, res: Response) => {

  if (!req.body.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const user = req.body.user; // ข้อมูลผู้ใช้ที่ได้จาก JWT token

  // ทำการส่งข้อมูลโปรไฟล์กลับไปให้ผู้ใช้
  res.json({
    message: 'User profile data',
    user,
  });
});

router.get('/', authenticateJWT, authorizeRole(['admin', 'advisor']), async (req: Request<any, any, any, any>, res: Response) => {
  try {
    const students = await getStudent(req.query?.search);
    res.status(200).json({ data: students });
  } catch (err: any) { res.status(500).json({ message: err?.message }); }
})

export default router;
