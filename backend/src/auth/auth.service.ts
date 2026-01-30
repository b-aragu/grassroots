import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto'; // Consider removing if unused
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async login(createAuthDto: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(createAuthDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        role: user.role,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }

  async register(createAuthDto: CreateAuthDto & { name: string }) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        password: hashedPassword,
        name: createAuthDto.name,
      },
    });

    return {
      message: "User registered successfully",
      userId: user.id
    }
  }

  // Placeholder methods for generated CRUD
  create(createAuthDto: CreateAuthDto) { return 'This action adds a new auth'; }
  findAll() { return `This action returns all auth`; }
  findOne(id: number) { return `This action returns a #${id} auth`; }
  update(id: number, updateAuthDto: UpdateAuthDto) { return `This action updates a #${id} auth`; }
  remove(id: number) { return `This action removes a #${id} auth`; }
}
