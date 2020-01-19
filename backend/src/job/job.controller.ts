import { Controller, Post, Get, Patch, Query, Body } from '@nestjs/common';
import { Job } from 'bull';
import { JobService } from './job.service';
import { ListJobDto } from './dto/list-job.dto';
import { CountJobResponseDto } from './dto/count-job.dto';
import { CreateJobRequest, CreateJobResponse } from './dto/create-job.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  findAll(@Query() query: ListJobDto): Promise<Job[]> {
    return this.jobService.find(query);
  }

  @Get('count')
  count(): Promise<CountJobResponseDto> {
    return this.jobService.count();
  }

  @Post()
  create(@Body() payload: CreateJobRequest): Promise<CreateJobResponse> {
    return this.jobService.add(payload);
  }

  @Patch()
  update() {
    //todo -> queueCommandHandler
  }

  @Get(':id')
  findById() {
    //todo -> findJobHandler
  }

  @Patch(':id')
  updateById() {
    //todo -> jobCommandHandler
  }
}
