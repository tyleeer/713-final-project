import prisma from "../prismaClient";
import * as repo from "../repo/StudentPepo";

export function getAdvisor() {
  return repo.getAdvisor();
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
        role: 'Student'
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