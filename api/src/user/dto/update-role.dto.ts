import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum({ admin: Role.Admin, user: Role.User })
  role: string;
}
