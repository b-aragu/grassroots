import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class WardsService {
  constructor(private prisma: PrismaService) { }

  create(createWardDto: CreateWardDto) {
    return 'This action adds a new ward';
  }

  findAll() {
    return `This action returns all wards`;
  }

  findOne(id: string) {
    return `This action returns a #${id} ward`;
  }

  update(id: string, updateWardDto: UpdateWardDto) {
    return `This action updates a #${id} ward`;
  }

  remove(id: string) {
    return this.prisma.ward.delete({
      where: { id },
    });
  }

  async getGeoJSON() {
    const wards = await this.prisma.ward.findMany();

    const features = wards
      .filter((ward: any) => ward.geometry) // Only include wards with geometry
      .map((ward: any) => ({
        type: 'Feature',
        geometry: ward.geometry,
        properties: {
          id: ward.id,
          name: ward.name,
          county: ward.county,
        },
      }));

    return {
      type: 'FeatureCollection',
      features,
    };
  }
}
