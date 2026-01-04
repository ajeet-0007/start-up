import {
  IsInt,
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OnDto } from 'src/modules/common/dtos/common.dto';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

export class UserDto {
  @IsNotEmpty()
  @IsInt()
  @Expose()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Expose()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Expose()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Expose()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Expose()
  lastName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Expose()
  phone?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose()
  isActive: boolean;

  @IsNotEmpty()
  @IsInt()
  @Expose()
  loyaltyPointsBalance: number;

  @IsNotEmpty()
  @IsObject()
  @Type(() => OnDto)
  @ValidateNested({ each: true })
  @Expose()
  created: OnDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => OnDto)
  @ValidateNested({ each: true })
  @Expose()
  updated: OnDto;

  @IsNotEmpty()
  @IsObject()
  @Type(() => OnDto)
  @ValidateNested({ each: true })
  @Expose()
  deleted: OnDto | null;

  constructor(obj: User) {
    if (!obj) return;
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.phone = obj.phone;
    this.isActive = obj.isActive;
    this.loyaltyPointsBalance = obj.loyaltyPointsBalance;
    this.created = { on: obj.createdAt };
    this.updated = { on: obj.updatedAt };
    this.deleted = obj.deletedAt ? { on: obj.deletedAt } : null;
  }

  static to(dto: CreateUserDto): User {
    const entity = new User();
    entity.username = dto.username;
    entity.email = dto.email;
    entity.password = dto.password;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.phone = dto.phone as string;
    entity.isActive = dto.isActive;
    entity.loyaltyPointsBalance = dto.loyaltyPointsBalance;
    entity.createdAt = new Date().toISOString();
    entity.updatedAt = new Date().toISOString();
    return entity;
  }

  static toUpdate(dto: UpdateUserDto): Partial<User> {
    const entity: Partial<User> = {};

    if (dto.username !== undefined) entity.username = dto.username;
    if (dto.email !== undefined) entity.email = dto.email;
    if (dto.password !== undefined) entity.password = dto.password;
    if (dto.firstName !== undefined) entity.firstName = dto.firstName;
    if (dto.lastName !== undefined) entity.lastName = dto.lastName;

    if (dto.phone !== undefined) entity.phone = dto.phone ?? null;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.loyaltyPointsBalance !== undefined)
      entity.loyaltyPointsBalance = dto.loyaltyPointsBalance;

    entity.updatedAt = new Date().toISOString();

    if (dto.deleted !== undefined) {
      entity.deletedAt = dto.deleted ? new Date().toISOString() : null;
    }

    return entity;
  }
}
