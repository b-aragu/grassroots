
import { PrismaClient, Role, MissionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const CONSTITUENCIES = ['Roysambu', 'Kasarani', 'Westlands', 'Langata', 'Dagoretti North'];
const WARD_NAMES = {
    'Roysambu': ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
    'Kasarani': ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
    'Westlands': ['Kitisuru', 'Parklands', 'Karura', 'Kangemi', 'Mountain View'],
    'Langata': ['Karen', 'Nairobi West', 'Mugumoini', 'South C', 'Nyayo Highrise'],
    'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro']
};

const NAMES = [
    'Kennedy', 'Sarah', 'David', 'Grace', 'Brian', 'James', 'Peter', 'John', 'Mary', 'Lucy',
    'Michael', 'Antony', 'Esther', 'Kevin', 'Mercy', 'Dennis', 'Rose', 'Paul', 'Joyce', 'Emily'
];
const SURNAMES = [
    'Mwangi', 'Otieno', 'Kamau', 'Ochieng', 'Mutua', 'Wanjiku', 'Odhiambo', 'Kimani', 'Njoroge', 'Auma',
    'Kipkorir', 'Nyambura', 'Nduta', 'Wafula', 'Anyango', 'Waweru', 'Njeri', 'Omondi', 'Kariuki', 'Nalianya'
];

async function main() {
    console.log('🌱 Starting seed...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Wards
    console.log('Creating Wards...');
    const wardMap: Record<string, string> = {}; // Name -> ID

    for (const constituency of CONSTITUENCIES) {
        const wards = WARD_NAMES[constituency as keyof typeof WARD_NAMES] || [];
        for (const wardName of wards) {
            try {
                // Upsert finding by name if possible, but name isn't unique in schema directly? 
                // Schema: id, name, county. uniqueness not guaranteed by schema but we'll assume uniqueness for seeding.
                // We'll just create or find first.
                let ward = await prisma.ward.findFirst({ where: { name: wardName } });
                if (!ward) {
                    ward = await prisma.ward.create({
                        data: {
                            name: wardName,
                            county: 'Nairobi',
                        }
                    });
                }
                wardMap[wardName] = ward.id;
            } catch (e) {
                console.error(`Error creating ward ${wardName}:`, e);
            }
        }
    }

    // 2. Create Users (Agents)
    console.log('Creating Agents...');
    const agents = [];
    // Flatten attributes for easier iteration
    const agentBlueprints = [];
    for (const constituency of CONSTITUENCIES) {
        const wards = WARD_NAMES[constituency as keyof typeof WARD_NAMES] || [];
        for (const ward of wards) {
            const agentsPerWard = Math.floor(Math.random() * 2) + 1; // 1-3 agents per ward
            for (let i = 0; i < agentsPerWard; i++) {
                agentBlueprints.push({ wardName: ward, constituency });
            }
        }
    }

    for (const blueprint of agentBlueprints) {
        const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
        const email = `${name.toLowerCase().replace(' ', '.')}.${Math.floor(Math.random() * 10000)}@grassroots.local`;

        try {
            const agent = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'VOLUNTEER',
                    points: Math.floor(Math.random() * 500),
                }
            });
            agents.push({ ...agent, assignedWardName: blueprint.wardName, assignedConstituency: blueprint.constituency });
            process.stdout.write('.');
        } catch (e) {
            // Ignore duplicates
        }
    }
    console.log(`\n✅ Created ${agents.length} agents.`);

    // 3. Create Missions and Checkins (History)
    console.log('Creating activity history...');

    const centers: Record<string, [number, number]> = {
        'Roysambu': [-1.218, 36.882],
        'Kasarani': [-1.220, 36.900],
        'Westlands': [-1.265, 36.800],
        'Langata': [-1.320, 36.770],
        'Dagoretti North': [-1.280, 36.750]
    };

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    for (const agent of agents) {
        if (!agent.assignedConstituency) continue;

        const center = centers[agent.assignedConstituency] || [-1.2921, 36.8219];
        const wardId = wardMap[agent.assignedWardName];
        if (!wardId) continue;

        // Guarantee at least 1 check-in for EVERY agent
        const numActivities = Math.floor(Math.random() * 5) + 1; // 1-5 activities

        for (let i = 0; i < numActivities; i++) {
            // Distribute times: mostly recent (last 24h) for demo purposes
            const isRecent = Math.random() > 0.3;
            const timeOffset = isRecent
                ? Math.random() * (24 * 60 * 60 * 1000) // Last 24h
                : Math.random() * (7 * 24 * 60 * 60 * 1000); // Last week

            const actionTime = new Date(Date.now() - timeOffset);

            // Larger Random jitter to spread them out visually on the map (approx 1-2km spread)
            const lat = center[0] + (Math.random() - 0.5) * 0.04;
            const lng = center[1] + (Math.random() - 0.5) * 0.04;

            // Create a Mission first (Completed)
            const mission = await prisma.mission.create({
                data: {
                    wardId: wardId,
                    location: `Patrol point near ${agent.assignedWardName}`,
                    geoLat: lat,
                    geoLng: lng,
                    status: 'COMPLETED',
                    assignedToId: agent.id,
                    createdAt: actionTime
                }
            });

            // Create CheckIn linked to Mission
            await prisma.checkIn.create({
                data: {
                    missionId: mission.id,
                    userId: agent.id,
                    lat: lat,
                    lng: lng,
                    timestamp: actionTime,
                    // Simulate random survey data or comments if needed
                }
            });
        }
    }

    console.log('\n✅ Seeding complete!');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
