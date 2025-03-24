// src/controllers/appointmentController.ts
import { Request, Response } from 'express';
import prisma from '../prismaClient';

// ฟังก์ชันสำหรับสร้างนัดหมาย
export const createAppointment = async (req: Request, res: Response) => {
  const { studentId, advisorId, topic, requestedDate } = req.body;

  // ตรวจสอบว่า advisor และ student มีอยู่ในฐานข้อมูลหรือไม่
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  const advisor = await prisma.advisor.findUnique({
    where: { id: advisorId },
  });

  if (!student || !advisor) {
    return res.status(404).json({ message: 'Student or Advisor not found' });
  }

  // สร้างนัดหมายใหม่ในฐานข้อมูล
  const appointment = await prisma.appointment.create({
    data: {
      studentId,
      advisorId,
      topic,
      requestedDate: new Date(requestedDate), // แปลงวันที่
    },
  });

  res.status(201).json(appointment); // ส่งกลับข้อมูลนัดหมายที่ถูกสร้าง
};
