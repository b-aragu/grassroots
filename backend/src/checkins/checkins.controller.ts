import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../config/storage.config';

@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig }))
  create(@Body() createCheckinDto: CreateCheckinDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      if (file.mimetype.startsWith('audio/')) {
        createCheckinDto.voiceNoteUrl = `/uploads/${file.filename}`;
      } else if (file.mimetype.startsWith('image/')) {
        createCheckinDto.photoUrls = [`/uploads/${file.filename}`];
      }
    }
    // Ensure numeric types (FormData converts everything to strings)
    createCheckinDto.lat = parseFloat(createCheckinDto.lat as any);
    createCheckinDto.lng = parseFloat(createCheckinDto.lng as any);

    return this.checkinsService.create(createCheckinDto);
  }

  @Get()
  findAll() {
    return this.checkinsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkinsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckinDto: UpdateCheckinDto) {
    return this.checkinsService.update(+id, updateCheckinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkinsService.remove(id);
  }
}
