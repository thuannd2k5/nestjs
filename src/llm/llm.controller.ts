import { Controller, Get, Param } from '@nestjs/common';
import { LlmService } from './llm.service';
import { Public } from 'src/decorator/customize';

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
}
