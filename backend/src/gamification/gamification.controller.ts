import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming you have this

@Controller('gamification')
export class GamificationController {
    constructor(private prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getStats(@Request() req: any) {
        const userId = req.user.id; // From JWT strategy

        const user: any = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                badges: {
                    include: { badge: true }
                },
                assignedMissions: {
                    where: { status: 'COMPLETED' }
                }
            }
        });

        const totalMissions = user?.assignedMissions?.length || 0;

        // Calculate Level (Simple logic: Level = 1 + Points / 100)
        const level = Math.floor((user?.points || 0) / 100) + 1;
        const nextLevelPoints = level * 100;
        const progress = (user?.points || 0) % 100;

        return {
            points: user?.points || 0,
            level,
            nextLevelPoints,
            progress, // percentage to next level (if 100 per level)
            completedMissions: totalMissions,
            badges: user?.badges?.map((ub: any) => ub.badge) || []
        };
    }
}
