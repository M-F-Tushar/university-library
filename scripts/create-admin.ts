import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
    const adminEmail = 'admin@university.edu';
    const adminPassword = 'admin123456'; // Change this to a secure password
    const adminName = 'Admin User';

    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', adminEmail);
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('⚠️  Please change the password after first login!');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
