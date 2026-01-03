import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LlmService } from './llm.service';
import { Public, SkipCheckPermission } from 'src/decorator/customize';
import { CreateJobAiDto } from './dto/create-llm.dto';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) { }

  @Get('check-company/:id')
  @Public()
  async checkCompany(@Param('id') id: string) {
    return await this.llmService.verifyCompany(id);
  }

  @Get('check-job/:id')
  @Public()
  async checkJob(@Param('id') id: string) {
    return await this.llmService.analyzeJobById(id);
  }

  @Post('ai-generate')
  @SkipCheckPermission()
  async generateJobByAi(
    @Body() dto: CreateJobAiDto,
  ) {
    return this.llmService.generateJobByAi(dto);
  }

}
