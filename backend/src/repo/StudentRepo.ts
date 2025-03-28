import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getAdvisor() {
    console.log('Fetching advisor.........')
    return prisma.advisor.findMany({
        include: {
            profile: {
                include: {
                    user: {
                        include: {
                            // role: true
                        },
                    },
                },
            },

        },
    });
}

export function getStudentByUserId(userId: number) {
    return prisma.user.findUnique({
        where: {
            id: userId
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
    })
}