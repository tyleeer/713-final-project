// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register Controller
export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body; // รับ role จาก body

  // ตรวจสอบว่ามีผู้ใช้ที่สมัครแล้วหรือไม่
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  // สร้างผู้ใช้ใหม่พร้อม role ที่ได้รับ
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: role || 'student', // กำหนด role ที่รับมาหรือใช้ 'student' เป็นค่าเริ่มต้น
    },
  });

  res.status(201).json({ user });
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // ตรวจสอบรหัสผ่าน
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // สร้าง JWT token พร้อม role
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role }, // เพิ่ม role ใน payload
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};