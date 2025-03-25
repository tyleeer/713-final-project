import { PrismaClient } from '@prisma/client';

async function createUsers(prisma: PrismaClient): Promise<void> {
    console.log('Seeding users...');

    //password password123
    const users = [
        { username: 'student001', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Student' },
        { username: 'student002', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Student' },
        { username: 'student003', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Student' },
        { username: 'advisor001', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Advisor' },
        { username: 'advisor002', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Advisor' },
        { username: 'advisor003', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Advisor' },
        { username: 'admin001', password: '$2a$12$Co8IJcuyth2QRTaemFBw/Ow423ZbDFrQwWp4rUrwsZk6iQm51xLT2', role: 'Admin' },
    ];

    for (const userData of users) {
        const role = await prisma.role.findUnique({ where: { name: userData.role } });
        if (!role) continue;

        await prisma.user.create({
            data: {
                username: userData.username,
                password: userData.password,
                role: { connect: { id: role.id } },
            },
        });
    }

    console.log(`Created ${users.length} users`);
}

export default createUsers;