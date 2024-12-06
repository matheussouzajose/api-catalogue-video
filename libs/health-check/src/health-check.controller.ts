import { HealthCheckService } from '@health-check/health-check.service';
import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  healthCheck() {
    return this.healthCheckService.execute();
  }
}
