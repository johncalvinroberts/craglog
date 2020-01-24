import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue, Job } from 'bull';
import { ListJobDto } from './dto/list-job.dto';
import { CountJobResponseDto } from './dto/count-job.dto';
import { CreateJobRequest, CreateJobResponse } from './dto/create-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectQueue('route') private readonly routeQueue: Queue,
    @InjectQueue('list') private readonly listQueue: Queue,
  ) {}

  private async addListJob(data): Promise<CreateJobResponse> {
    // if (parseInt(data) >= MAX_PAGE) {
    //   return { success: true };
    // }
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addListJob(item);
      }
      return { success: true };
    }

    if (!data) {
      // await execRedis(this.redisClient, 'incr', [CURRENT_SCRAPE_PAGE_KEY]);
      // await this.initNextPageScrape();
    } else {
      await this.listQueue.add('scrape', { page: data }, { jobId: data });
    }
    return { success: true };
  }

  private async addRouteJob(data): Promise<CreateJobResponse> {
    if (Array.isArray(data)) {
      for (const item of data) {
        await this.addRouteJob(item);
      }
      return { success: true };
    }
    const jobId = data.substring(data.lastIndexOf('/') + 1);
    this.routeQueue.add('scrape', { href: data }, { jobId });
    return { success: true };
  }

  async add(payload: CreateJobRequest): Promise<CreateJobResponse> {
    const { type, data } = payload;
    if (type === 'route') {
      return await this.addRouteJob(data);
    }

    if (type === 'list') {
      return await this.addListJob(data);
    }
  }

  async count(): Promise<CountJobResponseDto> {
    const [route, list] = await Promise.all([
      this.routeQueue.getJobCounts(),
      this.listQueue.getJobCounts(),
    ]);

    return { list, route };
  }

  find(query: ListJobDto): Promise<Job[]> {
    const { type, status, skip, limit } = query;
    const start = skip;
    const end = limit + skip - 1;
    if (type === 'route') {
      return this.routeQueue.getJobs([status], start, end);
    }

    if (type === 'list') {
      return this.listQueue.getJobs([status], start, end);
    }
  }

  async findById(id: string, type: string): Promise<Job> {
    const works = [];
    if (type === 'route') {
      works.push(this.routeQueue.getJob(id));
      works.push(this.routeQueue.getJobLogs(id));
    }

    if (type === 'list') {
      works.push(this.listQueue.getJob(id));
      works.push(this.listQueue.getJobLogs(id));
    }
    const [job, logs] = await Promise.all(works);
    console.log({job});
    return { ...job, logs };    
  }
}
