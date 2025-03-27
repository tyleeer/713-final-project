import express, { Request, Response } from 'express';
import { registerUser, registerAdvisor, loginUser, resetPassword } from '../services/authService';
import { authenticateJWT, authorizeRole } from '../middleware/authMiddleware'
import { uploadFile } from '../services/uploadFileService'
import prisma from '../prismaClient';
import multer from 'multer';

const router: express.Router = express.Router()

const upload = multer({ storage: multer.memoryStorage() });
const bucket = process.env.SUPABASE_BUCKET_NAME;

// Route สำหรับการสมัครสมาชิก
router.post('/register', upload.single('profilePic'), async (req: Request, res: Response) => {

  const { password, studentId, firstName, lastName, department } = req.body;
  try {

    const file = req.file;
    if (!file) {
      throw new Error('Please file uploaded.');
    }

    const filePath = "profile";

    if (!bucket || !filePath) {
      return res.status(500).json({ message: 'Bucket name or file path not configured.' });
    }

    if (firstName === '' || lastName === '' || department === '' || studentId === '' || password === '') {
      throw new Error('Please fill in all fields');
    }
    const { user, profile } = await registerUser(studentId, password, firstName, lastName, department);

    const ouputUrl = await uploadFile(bucket, filePath, file);

    if (ouputUrl) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          profilePic: ouputUrl
        }
      });
    }

    user.password = '';

    res.status(201).json({ message: 'User registered successfully', user, profile });

  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
});

// Route สำหรับการเข้าสู่ระบบ
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { token, role } = await loginUser(email, password);
    res.json({ message: 'Login successful', token, role });
  } catch (error: any) {
    res.status(401).json({ message: error?.message });
  }
});

// Route สำหรับการรีเซ็ตรหัสผ่าน
router.post('/reset-password', async (req: Request, res: Response) => {

  const { studentId: email, newPassword, oldPassword } = req.body;

  try {
    await resetPassword(email, oldPassword, newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
});


// advisor register
router.post('/register-advisor', authenticateJWT, authorizeRole(['admin']), upload.single('profilePic'), async (req: Request, res: Response) => {

  const { password, studentId, firstName, lastName, department, role, position} = req.body;

  try {

    const file = req.file;
    if (!file) {
      throw new Error('Please file uploaded.');
    }

    const filePath = "profile";

    if (!bucket || !filePath) {
      return res.status(500).json({ message: 'Bucket name or file path not configured.' });
    }

    
    if (firstName === '' || lastName === '' || department === '' || studentId === '' || password === '' || role === '') {
      throw new Error('Please fill in all fields');
    }
    const { user, profile } = await registerAdvisor(studentId, password, firstName, lastName, department, position, role);

    const ouputUrl = await uploadFile(bucket, filePath, file);

    if (ouputUrl) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: {
          profilePic: ouputUrl
        }
      });
    }

    user.password = '';

    res.status(201).json({ message: 'Advisor registered successfully', user, profile });

  } catch (error: any) {
    res.status(500).json({ message: error?.message });
  }
});

export default router