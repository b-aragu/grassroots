import { PrismaClient, Role, MissionStatus, SupportType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seeding...');

    // 1. Create Wards
    const ward1 = await prisma.ward.upsert({
        where: { id: 'ward-001' },
        update: {},
        create: {
            id: 'ward-001',
            name: 'Kibera Central',
            county: 'Nairobi',
        },
    });

    const ward2 = await prisma.ward.upsert({
        where: { id: 'ward-002' },
        update: {},
        create: {
            id: 'ward-002',
            name: 'Westlands',
            county: 'Nairobi',
        },
    });

    console.log('✅ Wards created');

    // 2. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@grassroots.com' },
        update: {},
        create: {
            email: 'admin@grassroots.com',
            name: 'Admin User',
            password: passwordHash,
            role: Role.ADMIN,
        },
    });

    const volunteer = await prisma.user.upsert({
        where: { email: 'volunteer@grassroots.com' },
        update: {},
        create: {
            email: 'volunteer@grassroots.com',
            name: 'Jane Doe',
            password: passwordHash,
            role: Role.VOLUNTEER,
            points: 50,
        },
    });

    console.log('✅ Users created');

    // 2.5 Create Badges
    const badges = [
        { id: 'badge-001', name: 'New Recruit', description: 'Joined the campaign', icon: 'medal' },
        { id: 'badge-002', name: 'Field Operative', description: 'Completed 5 missions', icon: 'map-pin' },
        { id: 'badge-003', name: 'Campaign Hero', description: 'Earned 1000 points', icon: 'trophy' },
    ];

    for (const badge of badges) {
        await prisma.badge.upsert({
            where: { id: badge.id },
            update: {},
            create: badge,
        });
    }

    console.log('✅ Badges created');

    // 3. Create Missions
    await prisma.mission.create({
        data: {
            wardId: ward1.id,
            location: 'Olympic Primary School',
            geoLat: -1.3129,
            geoLng: 36.7884,
            status: MissionStatus.PENDING,
        },
    });

    await prisma.mission.create({
        data: {
            wardId: ward2.id,
            location: 'Sarit Centre Entrance',
            geoLat: -1.2621,
            geoLng: 36.8025,
            status: MissionStatus.IN_PROGRESS,
            assignedToId: volunteer.id,
        },
    });

    console.log('✅ Missions created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
