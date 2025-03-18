import { PrismaClient } from '@prisma/client';

async function createProfiles(prisma: PrismaClient): Promise<void> {
    console.log('Seeding profiles...');

    const profiles = [
        { firstName: 'ก้อง', lastName: 'ศิริวัฒน์', department: 'คณะวิศวกรรมศาสตร์', username: 'student001' },
        { firstName: 'อิทธิพล', lastName: 'กาญจนศิลป์', department: 'คณะวิทยาศาสตร์', username: 'student002' },
        { firstName: 'ณัฐพงษ์', lastName: 'พรหมพิพัฒน์', department: 'คณะเศรษฐศาสตร์', username: 'student003' },
        { firstName: 'อาจารย์สมชาย', lastName: 'พัฒนากุล', department: 'คณะวิทยาศาสตร์', username: 'advisor001' },
        { firstName: 'อาจารย์สุธี', lastName: 'วงศ์สุวรรณ', department: 'คณะบริหารธุรกิจ', username: 'advisor002' },
        { firstName: 'อาจารย์มัณฑนา', lastName: 'เจริญสุข', department: 'คณะมนุษยศาสตร์', username: 'advisor003' },
        { firstName: 'สมพร', lastName: 'จันทร์ดี', department: 'สำนักงานบริหาร', username: 'admin001' },
    ];

    for (const profileData of profiles) {
        const user = await prisma.user.findUnique({ where: { username: profileData.username } });
        if (!user) continue;

        await prisma.profile.create({
            data: {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                department: profileData.department,
                userId: user.id,
            },
        });
    }

    console.log(`Created ${profiles.length} profiles`);
}

export default createProfiles;