export interface JobCountDto {
  waiting?: number;
  active?: number;
  completed?: number;
  failed?: number;
  delayed?: number;
  paused?: number;
}

export class CountJobResponseDto {
  readonly list: JobCountDto;
  readonly route: JobCountDto;
}
