import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class MissionsService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService
  ) { }

  create(createMissionDto: CreateMissionDto) {
    return this.prisma.mission.create({
      data: createMissionDto,
    });
  }

  findAll() {
    return this.prisma.mission.findMany({
      include: { ward: true, assignedTo: true },
    });
  }

  findOne(id: string) {
    return this.prisma.mission.findUnique({
      where: { id },
      include: { ward: true, assignedTo: true, checkIn: true },
    });
  }

  async update(id: string, updateMissionDto: UpdateMissionDto) {
    const mission = await this.prisma.mission.update({
      where: { id },
      data: updateMissionDto,
      include: { assignedTo: true }
    });

    // Gamification Logic: Award points if completed
    if (updateMissionDto.status === 'COMPLETED' && mission.assignedToId) {
      // Award 50 points
      await this.prisma.user.update({
        where: { id: mission.assignedToId },
        data: { points: { increment: 50 } }
      });

      // Check for badges
      this.gamificationService.checkAndAwardBadges(mission.assignedToId);
    }

    return mission;
  }

  remove(id: string) {
    return this.prisma.mission.delete({
      where: { id },
    });
  }

  async getGeoJSON() {
    const missions = await this.prisma.mission.findMany({
      include: { ward: true, assignedTo: true },
    });

    const features = missions.map((mission) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [mission.geoLng, mission.geoLat],
      },
      properties: {
        id: mission.id,
        location: mission.location,
        status: mission.status,
        ward: mission.ward.name,
        assignedTo: mission.assignedTo?.name || 'Unassigned',
      },
    }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
