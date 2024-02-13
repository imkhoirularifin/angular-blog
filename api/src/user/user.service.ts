import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    const result = paginate<User>(this.userRepository, options);
    (await result).items.forEach((item) => (item.password = undefined));
    return result;
  }

  findByFilter(filter: string, skip: number, take: number): Promise<any> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${filter}%`) },
        { email: Like(`%${filter}%`) },
        { name: Like(`%${filter}%`) },
      ],
      order: { name: 'DESC' },
      take: take,
      skip: skip,
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    user.password = undefined;
    return user;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const result = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    return result;
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userRepository.update(id, updateUserDto);
  }

  updateRole(id: string, role: UpdateRoleDto): Promise<any> {
    return this.userRepository.update(id, role);
  }

  remove(id: string): Promise<any> {
    return this.userRepository.softDelete(id);
  }

  restore(id: string): Promise<any> {
    return this.userRepository.restore(id);
  }
}
