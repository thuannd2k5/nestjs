import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import LlmPrompt from './prompts/llm.prompts';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name)
  private genAi: GoogleGenAI;
  constructor(
    private configService: ConfigService,

    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,

  ) {
    const ApiKey = this.configService.get('GEMINI_API_KEY')
    this.genAi = new GoogleGenAI({ apiKey: ApiKey })
  }

  private extractJSON(str: any): any | null {
    try {
      // Tìm vị trí dấu ngoặc nhọn đầu tiên và cuối cùng trong chuỗi
      const start = str.indexOf('{');
      const end = str.lastIndexOf('}');
      if (start === -1 || end === -1) return null;

      // Lấy chuỗi JSON con
      const jsonString = str.substring(start, end + 1);

      // Parse JSON ra object
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Lỗi khi parse JSON:', error);
      return null;
    }
  }


  getPostAdvices = async (captions: string[]) => {
    if (!Array.isArray(captions) || captions.length === 0) {
      throw new Error('captions must be a non-empty array');
    }

    const response = await this.genAi.models.generateContent({
      model: "gemini-2.5-flash",
      contents: LlmPrompt.PostAdvices(captions),
    });

    const responseText =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return this.extractJSON(responseText);
  };

  async analyzeCompany(company: any) {
    const response = await this.genAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: LlmPrompt.AnalyzeCompany(company),
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return this.extractJSON(text);
  }


  async verifyCompany(id: string) {
    const company = await this.companyModel.findById(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const aiResult = await this.analyzeCompany({
      name: company.name,
      address: company.address,
      description: company.description,
    });

    return {
      companyId: company.id,
      ai_verification: aiResult,
    };
  }

  async analyzeJob(job: any) {
    const response = await this.genAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: LlmPrompt.AnalyzeJob(job),
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return this.extractJSON(text);
  }

  async analyzeJobById(id: string) {
    const job = await this.jobModel.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      jobId: job._id,
      ai_analysis: await this.analyzeJob({
        name: job.name,
        description: job.description,
        skills: job.skills,
        salary: job.salary,
        location: job.location,
        level: job.level,
        company: job.company,
      }),
    };
  }


}
