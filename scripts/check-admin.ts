import prisma from '../lib/prisma';

async function checkAdminUser() {
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@university.edu' },
        });

        if (admin) {
            console.log('✅ Admin user found!');
            console.log('ID:', admin.id);
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('Password hash:', admin.password.substring(0, 20) + '...');
        } else {
            console.log('❌ Admin user not found!');
        }

        // List all users
        const allUsers = await prisma.user.findMany();
        console.log('\nAll users in database:', allUsers.length);
        allUsers.forEach(user => {
            console.log(`- ${user.email} (${user.role})`);
        });
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdminUser();
