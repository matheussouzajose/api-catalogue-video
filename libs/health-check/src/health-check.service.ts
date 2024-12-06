import { HealthCheckModuleOptions } from '@health-check/health-check.module';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheckService {
  constructor(
    private healthy: boolean,
    private name: string,
    private version: string,
  ) {}

  execute(): HealthCheckModuleOptions {
    return {
      healthy: this.healthy,
      name: this.name,
      version: this.version,
    };
  }
}
