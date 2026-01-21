import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    const newJob = await this.jobsService.create(createJobDto, user);
    return {
      _id: newJob?._id,
      createdAt: newJob?.createdAt
    };
  }

  @Get()
  @SkipCheckPermission()
  @ResponseMessage("Fetch jobs with pagination")
  async findAll(
    @Query("current") current: string,
    @Query("pageSize") pageSize: string,
    @Query() qs: string,
    @User() user: IUser
  ) {
    return await this.jobsService.findAll(+current, +pageSize, qs, user);
  }

  @Get(':id')
  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle(3, 60)
  @ResponseMessage("Fetch a job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a job")
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.jobsService.remove(id, user);
  }


  @Post('by-ids')
  async getJobsByIds(@Body('ids') ids: string[]) {
    return this.jobsService.findByIds(ids);
  }


}

