export class CreateRouteDto {
  readonly externalId?: string;
  readonly externalCragId?: string;
  readonly name?: string;
  readonly cragName?: string;
  readonly region?: string;
  readonly area?: string;
  readonly grade?: string;
  readonly latitude?: string;
  readonly longitude?: string;
  readonly height?: number;
  readonly bolts?: number;
  readonly style?: string;
}
