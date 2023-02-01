import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { RegiUserDTO } from 'src/DTO/regiUserDTO';
import { ROLE } from 'src/entity/userEntity';
import { AdminService } from './admin.service';

@Controller('/admin')
@UseGuards(AuthGuard(), RoleGuard)
export class AdminController {
  constructor(private serv: AdminService) {}

  @Get('/users')
  @ROLES(ROLE.ADMIN)
  getUsers() {
    return this.serv.getAllUsers();
  }

  @Post('/newuser')
  @ROLES(ROLE.ADMIN)
  newUser(@Body(ValidationPipe) user: RegiUserDTO) {
    return this.serv.addUser(user);
  }

  @Patch('/users/:id')
  @ROLES(ROLE.ADMIN)
  editUser(@Body(ValidationPipe) user: RegiUserDTO) {
    return this.serv.editUser(user);
  }

  @Delete('/users/:id')
  @ROLES(ROLE.ADMIN)
  deleteUser(@Param('id') id: number) {
    return this.serv.deleteUser(id);
  }
}
