import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';
import { PaginationDto } from '@app/modules/common/dtos/pagination.dto';

export class ListUserDto {
  @Expose()
  @Type(() => UserDto)
  value: UserDto[];

  @Expose()
  pagination: PaginationDto;
}
