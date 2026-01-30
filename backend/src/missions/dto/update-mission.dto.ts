import { PartialType } from '@nestjs/mapped-types';
import { CreateMissionDto } from './create-mission.dto';
import { MissionStatus } from '@prisma/client';

export class UpdateMissionDto extends PartialType(CreateMissionDto) {
    status?: MissionStatus;
}
