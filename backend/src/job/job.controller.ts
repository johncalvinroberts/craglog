import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RolesGuard } from '../shared/guards';
import { Roles } from '../shared/decorators';
import { PaginationDto } from '../shared/pagination.dto';
import { IsOptional, IsEnum } from 'class-validator';

enum StatusEnum {
  waiting,
  active,
  completed,
  failed,
  delayed,
  paused,
}

class JobQueryDto extends PaginationDto {
  constructor() {
    super();
  }

  @IsEnum(StatusEnum)
  @IsOptional()
  status: string;
}

class CreateJobDto {
  @IsOptional()
  @ApiProperty()
  url = '';
}

@Controller('jobs')
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class JobController {
  constructor(@InjectQueue('scraper') private readonly scraperQueue: Queue) {}

  @Roles('admin')
  @Get()
  @ApiQuery(JobQueryDto)
  proxyAll(@Query() query: JobQueryDto) {
    const { skip = 0, take = 100, status } = query;
    return this.scraperQueue.getJobs([status], skip, take);
  }

  @Post()
  @ApiBody({ type: CreateJobDto })
  async create(@Body() payload: CreateJobDto) {
    const { url } = payload;
    const { hostname } = new URL(url);
    const id = await this.scraperQueue.add(hostname, payload);
    return id;
  }

  @Get(':id')
  async findById(@Param('id') id) {
    const [job, logs] = await Promise.all([
      this.scraperQueue.getJob(id),
      this.scraperQueue.getJobLogs(id),
    ]);
    return { ...job, logs };
  }
}
