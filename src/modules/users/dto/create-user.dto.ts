import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, ['id']) {
  @ApiProperty({ required: true, description: 'Name of the user' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;
}
