import { Prisma, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export function getAdvisor() {
    console.log('Fetching advisor.........')
    return prisma.advisor.findMany({
        include: {
            profile: {
                include: {
                    user: {
                        include: {
                            role: true
                        },
                    },
                },
            },

        },
    });
}





