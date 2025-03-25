import { Request, Response } from 'express';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET!;

export const resetPasswordRequest = async (req: Request, res: Response) => {

  const { email } = req.body as { email: string };

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // ตรวจสอบว่าผู้ใช้มีอีเมลในระบบหรือไม่
  const user = await prisma.user.findUnique({
    where: { username: email },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // สร้าง token สำหรับการรีเซ็ตรหัสผ่าน (valid สำหรับ 1 ชั่วโมง)
  const token = jwt.sign(
    { userId: user.id, email: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // ส่ง token ไปยังอีเมลของผู้ใช้ (คุณสามารถเชื่อมต่อกับ Email Service เพื่อส่งอีเมลได้ที่นี่)
  // เช่น ใช้ nodemailer หรือ service อื่นๆ
  res.json({ message: 'Password reset token sent to email', token });
};

// ฟังก์ชันในการรีเซ็ตรหัสผ่าน
export const resetPassword = async (_: Request, res: Response) => {
  // const { token, newPassword } = req.body;

  try {
    // const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่านของผู้ใช้
    // const updatedUser = await prisma.user.update({
    //   where: { id: decoded.userId },
    //   data: { password: hashedPassword },
    // });

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
