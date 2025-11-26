import bcrypt from 'bcryptjs';

async function testPassword() {
    const password = 'admin123456';
    const hash = '$2b$10$p5rT12Q3ek/1JvVfpXxrEOYZjLZQxZKGZQxZKGZQxZKGZQxZKGZQx'; // Replace with actual hash from database

    console.log('Testing password:', password);
    console.log('Against hash:', hash);

    const match = await bcrypt.compare(password, hash);
    console.log('Match:', match);

    // Also test hashing
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);

    const newMatch = await bcrypt.compare(password, newHash);
    console.log('New match:', newMatch);
}

testPassword();
