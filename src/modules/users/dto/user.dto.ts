import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}
