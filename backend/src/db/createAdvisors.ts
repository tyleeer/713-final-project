import { PrismaClient } from '@prisma/client';

async function createAdvisors(prisma: PrismaClient): Promise<void> {
    console.log('Seeding advisors...');

    const advisorProfiles = await prisma.profile.findMany({
        where: { user: { username: { in: ['advisor001', 'advisor002', 'advisor003'] } } },
    });

    for (const profile of advisorProfiles) {
        await prisma.advisor.create({
            data: { profileId: profile.id },
        });
    }

    console.log(`Created ${advisorProfiles.length} advisor records`);
}

export default createAdvisors;