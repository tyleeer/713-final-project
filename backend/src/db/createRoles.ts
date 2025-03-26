import { PrismaClient } from '@prisma/client';

async function createRoles(prisma: PrismaClient): Promise<void> {
    console.log('Seeding roles...');

    const roles = ['Student', 'Advisor', 'Admin'];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role, users: '' }
        });
    }

    console.log(`Created ${roles.length} roles`);
}

export default createRoles;