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
