import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LlmService } from './llm.service';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';
import { Public } from 'src/decorator/customize';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) { }

  @Post()
  @Public()
  async create(@Body() createLlmDto: CreateLlmDto) {
    return await this.llmService.getPostAdvices(createLlmDto.captions);
  }

  @Get('verify/:id')
  @Public()
  verifyCompany(@Param('id') id: string) {
    return this.llmService.verifyCompany(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.llmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLlmDto: UpdateLlmDto) {
    return this.llmService.update(+id, updateLlmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.llmService.remove(+id);
  }
}
