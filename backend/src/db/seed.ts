import { PrismaClient } from '@prisma/client';
import createRoles from './createRoles';
import createUsers from './createUsers';
import createProfiles from './createProfiles';
import createStudents from './createStudents';
import createAdvisors from './createAdvisors';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding for Chiang Mai University system...');

    try {
        await createRoles(prisma);
        await createUsers(prisma);
        await createProfiles(prisma);
        await createAdvisors(prisma);
        await createStudents(prisma);

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .then(() => {
        console.log('Seed script execution completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed script execution failed:', error);
        process.exit(1);
    });
