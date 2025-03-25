import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//ส่งข้อความ
export const createCommend = async (studentId: number, advisorId: number, content: string) => {
  return await prisma.comment.create({
    data: {
      content,
      studentId,
      advisorId
    },
    include: {
      student: {
        include: {
          profile: true
        }
      },
      advisor: {
        include: {
          profile: true
        }
      },
      replies: {
        include: {
          comment: true
        }
      },
    },

  });
};

//ตอบกลับcomment
export const replytoComment = async (commentId: number, content: string, isStudent: boolean) => {
  //checkว่านักศึกษาหรืออาจารย์ที่ตอบกลับมา
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      student: true,
      advisor: true
    }
  });
  if (!comment) throw new Error('Comment not found');

  const senderId = isStudent ? comment.studentId : comment.advisorId;

  return await prisma.reply.create({
    data: {
      content,
      commentId,
      //ใช้ studentId/advisorId จาก comment แรก
      ...(isStudent
        ? { studentId: senderId }
        : { advisorId: senderId })
    },
    include: {
      comment: {
        include: {
          student: {
            include: {
              profile: true
            }
          },
          advisor: {
            include: {
              profile: true
            }
          }
        }
      }
    }
  });
};

//ดึงcommentนักศึกษาทั้งหมด
export const getStudentComments = async (studentId: number) => {
  return await prisma.comment.findMany({
    where: { studentId },
    include: {
      advisor: {
        include: {
          profile: true
        }
      },
      replies: true
    },
    orderBy: {
      id: 'desc'
    }
  });
};

//ดึงcommentอาจารย์ทั้งหมด
export const getAdvisorComment = async (advisorId: number) => {
  return await prisma.comment.findMany({
    where: { advisorId },
    include: {
      student: {
        include: {
          profile: true
        }
      },
      replies: true
    },
    orderBy: {
      id: 'desc'
    }
  });
};

// ดึงcommntที่พูดคุยทั้งหมดของนักศึกษาและอาจารย์
export const getConversation = async (studentId: number, advisorId: number) => {
  return await prisma.comment.findMany({
    where: {
      studentId,
      advisorId
    },
    include: {
      student: {
        include: {
          profile: true
        }
      },
      advisor: {
        include: {
          profile: true
        }
      },
      replies: true
    },
    orderBy: {
      id: 'asc'
    }
  });
};