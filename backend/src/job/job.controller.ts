import { Controller, UseGuards, All, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Server from 'http-proxy';
import { Request, Response } from 'express';
import { RolesGuard } from '../shared/guards';
import { Roles } from '../shared/decorators';

@Controller('job')
@UseGuards(RolesGuard)
@Roles('admin')
export class JobController {
  private server: Server;
  constructor(private readonly configService: ConfigService) {
    this.server = Server.createProxyServer();
  }

  @All()
  proxyAll(@Req() request: Request, @Res() response: Response): void {
    this.server.web(request, response, {
      changeOrigin: false,
      target: this.configService.get('JOBS_BACKEND_URL'),
    });
  }
}
