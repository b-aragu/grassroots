import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VolunteersService {
  constructor(private prisma: PrismaService) { }

  async create(createVolunteerDto: CreateVolunteerDto) {
    const hashedPassword = await bcrypt.hash(createVolunteerDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createVolunteerDto,
        password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'VOLUNTEER' },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, updateVolunteerDto: UpdateVolunteerDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateVolunteerDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
