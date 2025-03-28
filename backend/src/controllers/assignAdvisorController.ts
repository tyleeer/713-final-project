import { Request, Response } from 'express';
import prisma from '../prismaClient';

// กำหนดอาจารย์ที่ปรึกษากับนักศึกษาแต่ละคน
export const assignAdvisorToStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, advisorId } = req.body;

    // ตรวจสอบว่ามีนักศึกษากับอาจารย์ในระบบมั้ย
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId }
    });

    if (!student || !advisor) {
      return res.status(404).json({ error: 'Not found Student or Advisor' });
    }

    // อัปเดตอาจารย์ที่ปรึกษา
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { advisorId },
      include: {
        profile: true,
        advisor: {
          include: {
            profile: true
          }
        }
      }
    });

    res.json({
      message: 'Assigned successfully!',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error during assignment', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// แสดงข้อมูลอาจารย์ที่ปรึกษาและนักศึกษาที่ดูแล (แบ่งหน้า)
export const getAdvisorsWithStudentCount = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const [advisors, total] = await Promise.all([
      prisma.advisor.findMany({
        skip,
        take: limit,
        include: {
          profile: true,
          _count: { select: { students: true } }
        },
        orderBy: { profile: { firstName: 'asc' } }
      }),
      prisma.advisor.count()
    ]);

    res.json({
      data: advisors.map(a => ({
        id: a.id,
        name: `${a.profile.firstName} ${a.profile.lastName}`,
        studentCount: a._count.students
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
};

// แสดงข้อมูลอาจารย์ที่ปรึกษาและนักศึกษาที่ดูแล (แบ่งหน้า)
export const getAdvisorWithStudentCountById = async (req: Request, res: Response) => {
  try {
    const userData = req.user;
    const userId = userData?.userId ? parseInt(userData?.userId) : 0

    const advisorWithStudent = await prisma.advisor.findFirstOrThrow({
      where: {
        profile: {
          userId: userId
        }
      },
      include: {
        profile: true,
        students: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      advisor: advisorWithStudent
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
};

// แสดงการนัดหมายอาจารย์กับนักศึกษาแยกตามสถานะ
export const getAdvisorAppointmentsSummary = async (req: Request, res: Response) => {
  try {
    const { advisorId } = req.params;
    const { status } = req.query;

    // ตรวจสอบว่ามีอาจารย์นี้ในระบบมั้ย
    const advisor = await prisma.advisor.findUnique({
      where: { id: parseInt(advisorId) }
    });

    if (!advisor) {
      return res.status(404).json({ error: 'Not found Advisor' });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        advisorId: parseInt(advisorId),
        status: status as any
      },
      include: {
        student: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        requestedDate: 'desc'
      }
    });

    res.json({
      data: appointments.map(app => ({
        id: app.id,
        topic: app.topic,
        status: app.status,
        requestedDate: app.requestedDate,
        scheduledDate: app.scheduledDate,
        student: {
          id: app.student.id,
          name: `${app.student.profile.firstName} ${app.student.profile.lastName}`,
          studentId: app.student.studentId
        }
      }))
    });
  } catch (error) {
    console.error('Error during appointment', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// แก้ไขหรือเปลี่ยนอาจารย์ที่ปรึกษา
export const updateStudentAdvisor = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { advisorId } = req.body;

    // ตรวจสอบว่ามีนักศึกษาและอาจารย์นี้ในระบบมั้ย
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });

    const advisor = await prisma.advisor.findUnique({
      where: { id: advisorId }
    });

    if (!student || !advisor) {
      return res.status(404).json({ error: 'ไม่พบนักศึกษาหรืออาจารย์' });
    }

    // อัปเดตอาจารย์ที่ปรึกษา
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(studentId) },
      data: { advisorId },
      include: {
        profile: true,
        advisor: {
          include: {
            profile: true
          }
        }
      }
    });

    res.json({
      message: 'Change advisor successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Error during change advisor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};