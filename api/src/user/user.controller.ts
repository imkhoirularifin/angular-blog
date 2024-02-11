import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { Roles } from './decorator/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from './guard/roles.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 50 ? 50 : limit;
    return this.userService.paginate({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(id, updateUserDto);
  }

  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: UpdateRoleDto,
  ): Promise<any> {
    return this.userService.updateRole(id, role);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.userService.remove(id);
  }

  @Patch('restore/:id')
  restore(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.userService.restore(id);
  }
}
