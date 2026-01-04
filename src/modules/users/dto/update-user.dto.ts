import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OnDto } from 'src/modules/common/dtos/common.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsObject()
  @Type(() => OnDto)
  @ValidateNested({ each: true })
  @Expose()
  updated?: OnDto;

  @IsOptional()
  @IsObject()
  @Type(() => OnDto)
  @ValidateNested({ each: true })
  @Expose()
  deleted?: OnDto;
}
