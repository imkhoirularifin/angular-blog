import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Role } from './enums/role.enum';

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
      throw new NotFoundException('User not found');
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

  update(
    id: string,
    reqUserId: string,
    reqUserRole: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    if (reqUserRole !== Role.Admin && id !== reqUserId) {
      throw new UnauthorizedException(
        'You are not authorized to update this user',
      );
    }
    return this.userRepository.update(id, updateUserDto);
  }

  updateRole(id: string, reqUserId: string, role: UpdateRoleDto): Promise<any> {
    if (id === reqUserId) {
      throw new UnauthorizedException(
        'Administrators are unable to modify their own roles. Please contact another administrator for assistance with role changes.',
      );
    }
    return this.userRepository.update(id, role);
  }

  remove(id: string, reqUserId: string, reqUserRole: string): Promise<any> {
    if (reqUserRole !== Role.Admin && id !== reqUserId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this user',
      );
    }
    return this.userRepository.softDelete(id);
  }

  restore(id: string): Promise<any> {
    return this.userRepository.restore(id);
  }
}
