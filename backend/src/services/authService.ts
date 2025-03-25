import prisma from '../prismaClient';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;

// ฟังก์ชันในการสมัครสมาชิก
export const registerUser = async (
  studentId: string,
  password: string,
  firstName: string,
  lastName: string,
  department: string,
) => {

  // ตรวจสอบว่ามีผู้ใช้งานที่ใช้  นี้แล้วหรือไม่
  const existingUser = await prisma.user.findUnique({
    where: { username: studentId },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // เข้ารหัสรหัสผ่านก่อนบันทึก
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username: studentId,
      password: hashedPassword,
    },
  });

  if (!user) {
    throw new Error('User not created');
  }

  const profile = await prisma.profile.create({
    data: {
      firstName,
      lastName,
      department,
      userId: user.id,
    }
  });

  if (!profile) {
    throw new Error('Profile not created');
  }

  const countSTD = await prisma.student.count()
  const student = await prisma.student.create({
    data: {
      studentId: `${new Date().getFullYear() + 543}`.slice(2, 4) + countSTD.toString().padStart(4, '0'),
      profileId: profile.id,
    }
  })

  if (!student) {
    throw new Error('Student not created');
  }

  return { user, profile, student };
};

// ฟังก์ชันในการเข้าสู่ระบบ
export const loginUser = async (username: string, password: string) => {

  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { username },
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
  const token = jwt.sign({ userId: user.id, email: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION || '1h',
  } as jwt.SignOptions);

  return token;
};

// ฟังก์ชันในการรีเซ็ตรหัสผ่าน
export const resetPassword = async (username: string, oldPassword: string, newPassword: string) => {

  if (!username || !oldPassword || !newPassword) {
    throw new Error('Username, old password, and new password are required');
  }

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    throw new Error('User not found');
  }

  console.log(oldPassword)

  const comparePassword = await bcrypt.compare(oldPassword, user.password);
  if (!comparePassword) {
    throw new Error('Invalid old password');
  }

  // เข้ารหัสรหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // อัปเดตรหัสผ่านในฐานข้อมูล
  await prisma.user.update({
    where: { username },
    data: { password: hashedPassword },
  });
};
