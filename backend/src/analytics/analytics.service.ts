
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, MissionStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [
            totalVolunteers,
            totalMissions,
            completedMissions,
            totalWards,
            recentActivity
        ] = await Promise.all([
            this.prisma.user.count({ where: { role: Role.VOLUNTEER } }),
            this.prisma.mission.count(),
            this.prisma.mission.count({ where: { status: MissionStatus.COMPLETED } }),
            this.prisma.ward.count(),
            this.prisma.checkIn.findMany({
                take: 5,
                orderBy: { timestamp: 'desc' },
                include: {
                    user: { select: { name: true } },
                    mission: { select: { location: true } }
                }
            })
        ]);

        return {
            overview: {
                volunteers: totalVolunteers,
                missions: totalMissions,
                completionRate: totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0,
                wards: totalWards,
            },
            recentActivity: recentActivity.map(activity => ({
                id: activity.id,
                user: activity.user.name,
                mission: activity.mission?.location || 'General Check-in',
                time: activity.timestamp,
            }))
        };
    }
}
