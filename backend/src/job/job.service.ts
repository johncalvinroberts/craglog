import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface CreateJobRequest {
  type: string;
  data: unknown;
}

interface CreateJobResponse {
  success: boolean;
}

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
      this.listQueue.add({ page: data }, { jobId: data });
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
    this.routeQueue.add({ href: data }, { jobId });
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

  async count(): Promise<unknown> {
    const [route, list] = await Promise.all([
      this.routeQueue.getJobCounts(),
      this.listQueue.getJobCounts(),
    ]);

    return { list, route };
  }
}
