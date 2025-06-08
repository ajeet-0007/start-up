import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'defaultdb',
      useClass: DatabaseService,
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
