import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getAnnouncements() {
    return prisma.announcement.findMany({
        include: {
            advisor: {
                include: {
                    profile: true
                }
            }
        }
    });
}

export function getAnnouncementsByStudent(studentId: number, advisorId: number) {
    return prisma.announcement.findMany({
        where: {
            AND: [
                { advisorId: advisorId },
                {
                    advisor: {
                        profile: {
                            Advisor: {
                                students: {
                                    some: {
                                        id: studentId
                                    },
                                },
                            }
                        }
                    }
                }
            ]
        },
        include: {
            advisor: {
                include: {
                    profile: true
                }
            }
        }
    });
}

export function getAnnouncementsByAdvisor(advisorId: number) {
    return prisma.announcement.findMany({
        where: { advisorId: advisorId },
        include: {
            advisor: {
                include: {
                    profile: true
                }
            }
        }
    });
}
