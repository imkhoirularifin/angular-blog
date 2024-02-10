import {
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signup(@Body() payload: CreateUserDto): Promise<any> {
    return this.authService.register(payload);
  }

  // example protected route
  @UseGuards()
  @Get('profile')
  getProfile(): any {
    return 'profile works';
  }
}
