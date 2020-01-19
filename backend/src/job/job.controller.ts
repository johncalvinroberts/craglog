import { InjectQueue } from '@nestjs/bull';
import { Controller, Post, Get, Patch } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('job')
export class JobController {
  constructor(
    @InjectQueue('route') private readonly routeQueue: Queue,
    @InjectQueue('list') private readonly listQueue: Queue,
  ) {}

  @Get()
  findAll() {
    //todo -> jobListHandler
  }

  @Get('count')
  count() {
    //todo -> jobCountHandler
  }

  @Post()
  create() {
    //todo -> addHandler
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
