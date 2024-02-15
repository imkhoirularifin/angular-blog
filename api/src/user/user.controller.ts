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
  UseInterceptors,
  UploadedFile,
  Post,
  Request,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 50 ? 50 : limit;
    return this.userService.paginate({ page, limit });
  }

  @Get('search')
  FindByFilter(
    @Query('filter') filter: string = '',
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ): Promise<any> {
    return this.userService.findByFilter(filter, skip, take);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ): Promise<any> {
    return this.userService.update(
      id,
      req.user.userId,
      req.user.role,
      updateUserDto,
    );
  }

  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() role: UpdateRoleDto,
    @Request() req: any,
  ): Promise<any> {
    return this.userService.updateRole(id, req.user.userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: any,
  ): Promise<any> {
    return this.userService.remove(id, req.user.userId, req.user.role);
  }

  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('restore/:id')
  restore(@Param('id', new ParseUUIDPipe()) id: string): Promise<any> {
    return this.userService.restore(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    const response = await this.cloudinaryService.uploadImage(file);
    return this.userService.update(
      req.user.userId,
      req.user.userId,
      req.user.role,
      {
        profileImage: response.url,
      },
    );
  }
}
