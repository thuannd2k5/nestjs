import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage("Create a new permission")
  async create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    const permission = await this.permissionsService.create(createPermissionDto, user);
    return {
      _id: permission?._id,
      createdAt: permission?.createdAt
    }
  }

  @Get()
  @ResponseMessage("Fetch Permission with paginate")
  async findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
  ) {
    return await this.permissionsService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch Permission by ID")
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a permission")
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser) {
    return await this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a permission")
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.permissionsService.remove(id, user);
  }
}
