import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RolesGuard } from '../shared/guards';
import { Roles } from '../shared/decorators';

// TODO: use classes for these, for validation
interface JobQueryDto {
  skip: number;
  limit: number;
  status: string;
}

interface CreateJobDto {
  url: string;
}

@Controller('job')
@UseGuards(RolesGuard)
export class JobController {
  constructor(@InjectQueue('scraper') private readonly scraperQueue: Queue) {}

  @Roles('admin')
  @Get('/admin')
  proxyAll(@Query() query: JobQueryDto) {
    const { skip = 0, limit = 100, status } = query;
    return this.scraperQueue.getJobs([status], skip, limit);
  }

  @Post()
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
