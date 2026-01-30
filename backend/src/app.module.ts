import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { AuthModule } from './auth/auth.module';
import { MissionsModule } from './missions/missions.module';
import { CheckinsModule } from './checkins/checkins.module';
import { WardsModule } from './wards/wards.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GamificationModule } from './gamification/gamification.module';

@Module({
  imports: [PrismaModule, VolunteersModule, AuthModule, MissionsModule, CheckinsModule, WardsModule, AnalyticsModule, GamificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
