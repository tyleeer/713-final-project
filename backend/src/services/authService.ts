import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;

// ฟังก์ชันในการสมัครสมาชิก
export const registerUser = async (email: string, password: string) => {
  // ตรวจสอบว่ามีผู้ใช้งานที่ใช้ email นี้แล้วหรือไม่
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // เข้ารหัสรหัสผ่านก่อนบันทึก
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
};

// ฟังก์ชันในการเข้าสู่ระบบ
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // ตรวจสอบรหัสผ่านที่เข้ารหัสแล้ว
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // สร้าง JWT token
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return token;
};

// ฟังก์ชันในการรีเซ็ตรหัสผ่าน
export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // เข้ารหัสรหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // อัปเดตรหัสผ่านในฐานข้อมูล
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
};
