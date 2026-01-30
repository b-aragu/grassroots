import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
    private readonly logger = new Logger(GamificationService.name);

    constructor(private prisma: PrismaService) { }

    async checkAndAwardBadges(userId: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    assignedMissions: { where: { status: 'COMPLETED' } },
                    badges: true,
                },
            });

            if (!user) return;

            const completedMissionsCount = user.assignedMissions.length;
            const points = user.points;
            const existingBadgeIds = new Set(user.badges.map((b) => b.badgeId));

            const badgesToAward: string[] = [];

            // Badge 1: New Recruit (First Mission Completed)
            if (completedMissionsCount >= 1 && !existingBadgeIds.has('badge-001')) {
                badgesToAward.push('badge-001');
            }

            // Badge 2: Field Operative (5 Missions Completed)
            if (completedMissionsCount >= 5 && !existingBadgeIds.has('badge-002')) {
                badgesToAward.push('badge-002');
            }

            // Badge 3: Campaign Hero (1000 Points)
            if (points >= 1000 && !existingBadgeIds.has('badge-003')) {
                badgesToAward.push('badge-003');
            }

            // Award Badges
            for (const badgeId of badgesToAward) {
                await this.prisma.userBadge.create({
                    data: {
                        userId,
                        badgeId,
                    },
                });
                this.logger.log(`Awarded badge ${badgeId} to user ${userId}`);
            }

        } catch (error) {
            this.logger.error(`Error checking badges for user ${userId}`, error);
        }
    }
}
