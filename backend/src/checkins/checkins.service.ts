import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class CheckinsService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService
  ) { }

  async create(createCheckinDto: CreateCheckinDto) {
    const { missionId, userId, ...checkInData } = createCheckinDto;

    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission not found');

    const result = await this.prisma.$transaction([
      this.prisma.checkIn.create({
        data: {
          ...checkInData,
          mission: { connect: { id: missionId } },
          user: { connect: { id: userId } },
        },
      }),
      this.prisma.mission.update({
        where: { id: missionId },
        data: { status: 'COMPLETED' },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: { points: { increment: 10 } },
      }),
    ]);

    // Check for badges asynchronously
    this.gamificationService.checkAndAwardBadges(userId);

    return result;
  }

  findAll() {
    return this.prisma.checkIn.findMany({ include: { user: true, mission: true } });
  }

  findOne(id: string) {
    return this.prisma.checkIn.findUnique({
      where: { id },
      include: { user: true, mission: true },
    });
  }

  update(id: number, updateCheckinDto: UpdateCheckinDto) {
    return `This action updates a #${id} checkin`;
  }

  remove(id: string) {
    return this.prisma.checkIn.delete({ where: { id } });
  }
}
