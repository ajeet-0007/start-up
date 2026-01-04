import { Expose } from 'class-transformer';
import { IsISO8601, IsNotEmpty } from 'class-validator';

export class OnDto {
  @IsNotEmpty()
  @IsISO8601()
  @Expose()
  on: string;
}
