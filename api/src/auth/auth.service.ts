import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }
    // compare hashed password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      user.password = undefined;
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDto): Promise<any> {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create(user);
    newUser.password = undefined;
    return newUser;
  }
}
