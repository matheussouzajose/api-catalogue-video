import { HealthCheckController } from '@health-check/health-check.controller';
import { HealthCheckService } from '@health-check/health-check.service';
import { DynamicModule, Module, Provider } from '@nestjs/common';

export interface HealthCheckModuleOptions {
  healthy: boolean;
  name: string;
  version: string;
}

@Module({})
export class HealthCheckModule {
  static forRoot(options: HealthCheckModuleOptions): DynamicModule {
    const healthCheckService: Provider = {
      provide: HealthCheckService,
      useValue: new HealthCheckService(
        options.healthy,
        options.name,
        options.version,
      ),
    };
    return {
      module: HealthCheckModule,
      controllers: [HealthCheckController],
      providers: [healthCheckService],
      exports: [healthCheckService],
    };
  }
}
