import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.config.get('MYSQL_DATABASE_HOST'),
      port: +this.config.get('MYSQL_DATABASE_PORT'),
      username: this.config.get('MYSQL_DATABASE_USER'),
      password: this.config.get('MYSQL_DATABASE_PASSWORD'),
      database: this.config.get('MYSQL_DATABASE_NAME'),
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    };
  }
}
