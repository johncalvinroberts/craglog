import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
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

enum QueueCommandEnum {
  pause,
  resume,
}

enum JobCommandEnum {
  retry,
  remove,
  promote,
  discard,
  moveToCompled,
  moveToFailed,
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

class CommandQueueDto {
  @IsOptional()
  @ApiProperty()
  @IsEnum(QueueCommandEnum)
  command = '';
}

class CommandJobDto {
  @IsOptional()
  @ApiProperty()
  @IsEnum(JobCommandEnum)
  command = '';
}

enum SupportedScraperSites {
  'thecrag.com',
  'mountainproject.com',
  '27crags.com',
}

@Controller('jobs')
@ApiTags('jobs')
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
  async create(@Body() payload: CreateJobDto): Job {
    const { url } = payload;
    let { hostname } = new URL(url);
    if (hostname.startsWith('www.')) {
      hostname = hostname.replace('www.', '');
    }
    if (hostname in SupportedScraperSites) {
      const job = await this.scraperQueue.add(hostname, payload);
      return job;
    } else {
      throw new BadRequestException('Source site not supported');
    }
  }

  @Get('count')
  @Roles('admin')
  async count() {
    return this.scraperQueue.getJobCounts();
  }

  @Roles('admin')
  @Patch('command')
  async commandQueue(@Body() { command }: CommandQueueDto) {
    return this.scraperQueue[command]();
  }

  @Roles('admin')
  @Patch(':id')
  async commandJob(@Body() { command }: CommandJobDto, @Param('id') id) {
    const job: Job = await this.scraperQueue.getJob(id);
    if (!job) {
      throw new NotFoundException();
    }
    const res = await job[command]();
    return res;
  }

  @Get(':id')
  async findById(@Param('id') id) {
    const [job, logs] = await Promise.all([
      this.scraperQueue.getJob(id),
      this.scraperQueue.getJobLogs(id),
    ]);

    if (!job) {
      throw new NotFoundException();
    }

    return { ...job.toJSON(), logs: logs.logs };
  }
}
