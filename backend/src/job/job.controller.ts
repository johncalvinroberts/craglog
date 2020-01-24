import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Body,
  Param,
} from '@nestjs/common';
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
  async findById(
    @Param('id') id,
    @Query() query: { type: string },
  ): Promise<Job> {
    const { type } = query;
    return await this.jobService.findById(id, type);
  }

  @Patch(':id')
  updateById(@Param('id') id, @Body() data): Promise<unknown> {
    return Promise.resolve(data);
  }
}
