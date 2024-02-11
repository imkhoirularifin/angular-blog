import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new NotFoundException('User not found');
    }
    // compare hashed password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      user.password = undefined;
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateUserDto): Promise<any> {
    // check if username || email already exists
    const userExists = await this.userService.findByUsernameOrEmail(user.email);
    const usernameExists = await this.userService.findByUsernameOrEmail(
      user.username,
    );
    if (userExists || usernameExists) {
      throw new ConflictException(
        'User with the provided email or username already exists.',
      );
    }
    // hash password before saving
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await this.userService.create(user);
    // strip password before returning
    newUser.password = undefined;
    return newUser;
  }
}
