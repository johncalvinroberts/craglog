export class CreateJobRequest {
  readonly type: string;
  readonly data: unknown;
}

export class CreateJobResponse {
  success: boolean;
}
