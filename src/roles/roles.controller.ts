import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage("Create a new role")
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    const role = await this.rolesService.create(createRoleDto, user);

    return {
      _id: role?._id,
      createdAt: role?.createdAt
    }
  }

  @Get()
  @ResponseMessage("Fetch role with paginate")
  async findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return await this.rolesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch role by id")
  async findOne(@Param('id') id: string,) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a role")
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser
  ) {
    return await this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a role")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
}
