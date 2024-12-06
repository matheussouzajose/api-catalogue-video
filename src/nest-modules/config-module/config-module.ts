import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

type APP_SCHEMA_TYPE = {
  EXTERNAL_PORT: number;
};

export const APP_SCHEMA_SCHEMA: Joi.StrictSchemaMap<APP_SCHEMA_TYPE> = {
  EXTERNAL_PORT: Joi.number().optional(),
};

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...APP_SCHEMA_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
