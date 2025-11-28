import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage("Create a new resume")
  async create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    const cv = await this.resumesService.create(createUserCvDto, user);
    return {
      _id: cv?._id,
      createdAt: cv?.createdAt
    };
  }

  @Get()
  @ResponseMessage("Fetch all resumes with paginate")
  async findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string
  ) {
    return await this.resumesService.findAll(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch a resume by id")
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Change status a Resume")
  async update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUser) {
    return await this.resumesService.update(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a resume by id")
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.resumesService.remove(id, user);
  }

  @Post('by-user')
  @ResponseMessage("Get resume by User")
  async findResumeByUser(@User() user: IUser) {
    return await this.resumesService.findResumeByUser(user);
  }
}
