import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { processTheCrag } from './thecrag.process';
import { process27Crags } from './27crags.process';
import { processMountainProject } from './mountainproject.process';

@Processor('scraper')
export class JobProcessor {
  private readonly logger = new Logger(JobProcessor.name);

  @Process('thecrag.com')
  async handleTheCrag(job: Job) {
    this.logger.debug('Received job to scrape thecrag');
    const ret = await processTheCrag(job);
    this.logger.debug(`finished scraping thecrag, ${JSON.stringify(ret)}`);
    return ret;
  }

  @Process('27crags.com')
  async handle27Crags(job: Job) {
    this.logger.debug('Received job to scrape thecrag');
    const ret = await process27Crags(job);
    this.logger.debug(`finished scraping thecrag, ${JSON.stringify(ret)}`);
    return ret;
  }

  @Process('mountainproject.com')
  async handleMountainProject(job: Job) {
    this.logger.debug('Received job to scrape thecrag');
    const ret = await processMountainProject(job);
    this.logger.debug(`finished scraping thecrag, ${JSON.stringify(ret)}`);
    return ret;
  }
}
