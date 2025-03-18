import { PrismaClient } from '@prisma/client';

async function createStudents(prisma: PrismaClient): Promise<void> {
    console.log('Seeding students...');

    const studentProfiles = await prisma.profile.findMany({
        where: { user: { username: { in: ['student001', 'student002', 'student003'] } } },
    });

    const advisors = await prisma.advisor.findMany();
    let advisorIndex = 0;

    for (const profile of studentProfiles) {
        await prisma.student.create({
            data: {
                studentId: `65000${advisorIndex + 1}`,
                profileId: profile.id,
                advisorId: advisors[advisorIndex % advisors.length].id,
            },
        });
        advisorIndex++;
    }

    console.log(`Created ${studentProfiles.length} student records`);
}

export default createStudents;
