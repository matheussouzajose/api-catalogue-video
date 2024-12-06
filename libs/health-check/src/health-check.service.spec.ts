import { HealthCheckService } from '@health-check/health-check.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthCheckService', () => {
  let service: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: new HealthCheckService(
            true,
            'Code Flix',
            process.env.npm_package_version,
          ),
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be "Thepes store - Serviço de CMS"', () => {
    const expected = {
      healthy: true,
      name: 'Code Flix',
      version: process.env.npm_package_version,
    };
    expect(service.execute()).toBeDefined();
    expect(service.execute()).toMatchObject(expected);
  });
});
