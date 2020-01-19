enum JobTypeEnum {
  route = 'route',
  list = 'list',
}

enum StatusEnum {
  waiting = 'waiting',
  active = 'active',
  completed = 'completed',
  failed = 'failed',
  delayed = 'delayed',
  paused = 'paused',
}

export class ListJobDto {
  readonly type?: JobTypeEnum = JobTypeEnum.list;
  readonly status?: StatusEnum = StatusEnum.active;
  readonly skip?: number = 0;
  readonly limit?: number = 25;
}
