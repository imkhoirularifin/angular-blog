import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Observable<User> {
    return from(this.userRepository.save(createUserDto));
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  findOne(id: string): Observable<User> {
    return from(this.userRepository.findOneBy({ id }));
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<any> {
    return from(this.userRepository.update(id, updateUserDto));
  }

  remove(id: string): Observable<any> {
    return from(this.userRepository.softDelete(id));
  }

  restore(id: string): Observable<any> {
    return from(this.userRepository.restore(id));
  }
}
