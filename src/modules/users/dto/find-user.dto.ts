import { SortOrder } from '@app/modules/common/constants/sort-order';
import { PaginationDto } from '@app/modules/common/dtos/pagination.dto';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SortBy } from '../constant/user.constant';

class FilterDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Expose()
  ids?: number[];

  @IsOptional()
  @IsString()
  @Expose()
  username?: string;

  @IsOptional()
  @IsEmail()
  @Expose()
  email?: string;
}

class SortDto {
  @IsEnum(SortBy)
  @Expose()
  by: SortBy;

  @IsEnum(SortOrder)
  @Expose()
  order: SortOrder;
}

export class FindUserDto {
  @IsOptional()
  @Type(() => FilterDto)
  @ValidateNested()
  @Expose()
  filter?: FilterDto;

  @IsOptional()
  @Type(() => SortDto)
  @ValidateNested()
  @Expose()
  sort?: SortDto[];

  @IsOptional()
  @Type(() => PaginationDto)
  @ValidateNested({ each: true })
  @Expose()
  pagination?: PaginationDto;

  constructor(partial: Partial<FindUserDto>) {
    Object.assign(this, partial);
  }
}
