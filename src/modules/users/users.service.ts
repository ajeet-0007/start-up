import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CustomException } from '../common/exceptions/custom-exception';
import { UserDto } from './dto/user.dto';
import { ListUserDto } from './dto/list-user.dto';
import { paginationTransform } from '../common/services/pagination-transform';
import { FindUserDto } from './dto/find-user.dto';
import { SortBy } from './constant/user.constant';
import { SortOrder } from '../common/constants/sort-order';
import { SortTansform } from '../common/services/sort-transform';
import { generatePaginationResponse } from '../common/services/generate-pagination-response';

@Injectable()
export class UsersService {
  constructor(
    //Inject repositories or other services here if needed
    @InjectRepository(User, 'defaultdb') // Assuming you have a User entity
    private readonly repo: Repository<User>, // Adjust based on your ORM
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const entity = UserDto.to(createUserDto);
    const user = await this.repo.save(entity);
    return new UserDto(user);
  }

  async findAll({
    filter,
    pagination,
    sort,
  }: FindUserDto): Promise<ListUserDto> {
    const { skip, take } = paginationTransform(pagination);

    const where: any = {};
    if (filter?.username) {
      where.username = filter.username;
    }
    if (filter?.email) {
      where.email = filter.email;
    }
    if (filter?.ids) {
      where.id = In(filter.ids);
    }

    if (!sort || sort.length === 0) {
      sort = [{ by: SortBy.ID, order: SortOrder.DESC }];
    }

    const order: any = SortTansform(sort);
    const [users, total] = await Promise.all([
      this.repo.find({
        where,
        skip,
        take,
        order,
        select: [
          'id',
          'username',
          'email',
          'firstName',
          'lastName',
          'phone',
          'isActive',
          'loyaltyPointsBalance',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      }),
      this.repo.count({ where }),
    ]);
    return {
      value: users.map((user) => new UserDto(user)),
      pagination: generatePaginationResponse(
        pagination.page,
        pagination?.limit,
        total,
      ),
    };
  }

  async findOne(filter: { id?: number; email?: string }): Promise<UserDto> {
    let where = {};
    if (filter.id) {
      where = { id: filter.id };
    }
    if (filter.email) {
      where = { ...where, email: filter.email };
    }

    const user = await this.repo.findOne({
      where,
      select: [
        'id',
        'username',
        'email',
        'firstName',
        'lastName',
        'phone',
        'isActive',
        'loyaltyPointsBalance',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ],
    });
    // If no user is found, throw a custom exception
    if (!user) {
      throw new CustomException('User not found', 10404, {
        filename: __filename,
        method: 'UsersService.findOne',
        payload: filter,
      });
    }
    return new UserDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const prev = await this.findOne({ id });
    const curr = { ...prev, ...updateUserDto };
    const entity = UserDto.toUpdate(curr as UpdateUserDto);
    if (Object.keys(entity).length === 0) {
      return;
    }
    await this.repo.update(id, entity);
  }

  async remove(id: number) {
    await this.repo.softDelete(id);
  }
}
