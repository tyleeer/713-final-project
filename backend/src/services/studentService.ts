import prisma from "../prismaClient";
import * as repo from "../repo/StudentRepo";

export function getAdvisor() {
  return repo.getAdvisor();
}

export function getStudentByUserId(userId: number) {
  return repo.getStudentByUserId(userId);
}

export const getStudent = async (query = '') => {

  const students = await prisma.user.findMany({
    where: {
      OR: [
        { profile: { firstName: { contains: query } } },
        { profile: { lastName: { contains: query } } },
        { username: { contains: query } }
      ],
      AND: {
        role: 'student'
      }
    },
    include: {
      profile: {
        include: {
          Student: {
            include: {
              advisor: {
                include: {
                  profile: true
                }
              }
            }
          }
        }
      },
    },
  });

  const _students = students?.flatMap((val) => ({
    ...val,
    password: '',
  }));

  return _students;
}