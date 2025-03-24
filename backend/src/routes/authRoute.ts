import express, { Request, Response } from 'express';
import { registerUser, loginUser, resetPassword } from '../services/authService';

const router = express.Router();

// Route สำหรับการสมัครสมาชิก
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Route สำหรับการเข้าสู่ระบบ
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Route สำหรับการรีเซ็ตรหัสผ่าน
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  try {
    await resetPassword(email, newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
});

export default router;
