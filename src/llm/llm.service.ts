import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';
import LlmPrompt from './prompts/llm.prompts';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { MOCK_GENERATED_JOB } from './job-generate.mock';
import { MOCK_COMPANY_VERIFICATION } from './mock/company-analyze.mock';
import { MOCK_JOB_ANALYSIS } from './mock/job-analyze.mock';
import { MOCK_CAREER_CHAT } from './mock/career-chat.mock';
import { MOCK_POST_ADVICES } from './mock/post-advices.mock';

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
    if (this.configService.get('MOCK_AI') === 'true') {
      this.logger.warn('⚠ Using MOCK AI for post advices');
      return MOCK_POST_ADVICES;
    }

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
    if (this.configService.get('MOCK_AI') === 'true') {
      this.logger.warn('⚠ Using MOCK AI for company verification');
      return MOCK_COMPANY_VERIFICATION;
    }
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
    if (this.configService.get('MOCK_AI') === 'true') {
      this.logger.warn('⚠ Using MOCK AI for job analysis');
      return MOCK_JOB_ANALYSIS;
    }
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


  async careerChat(
    history: any[],
    userMessage: string,
    context?: any,
  ) {
    try {

      if (this.configService.get('MOCK_AI') === 'true') {
        this.logger.warn('⚠ Using MOCK AI for career chat');
        return MOCK_CAREER_CHAT;
      }

      const response = await this.genAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: LlmPrompt.CareerChatBot(
          history,
          userMessage,
          context,
        ),
      });

      const text =
        response.candidates?.[0]?.content?.parts?.[0]?.text;

      return this.extractJSON(text);

    } catch (error: any) {
      if (error?.error?.code === 503) {
        return {
          reply:
            'Hiện tại hệ thống đang quá tải, bạn vui lòng thử lại sau ít phút.',
          analysis: ['AI provider overloaded'],
          follow_up_questions: [],
        };
      }

      throw error;
    }
  }


  // Viết JD dựa trên input từ HR
  async generateJobByAi(jobInput: any) {

    if (this.configService.get('MOCK_AI') === 'true') {
      this.logger.warn('⚠ Using MOCK AI for job generation');
      return MOCK_GENERATED_JOB;
    }

    const response = await this.genAi.models.generateContent({
      model: 'gemini-2.0-flash', // nhẹ, ổn định
      contents: LlmPrompt.GenerateJobDescription(jobInput),
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    return this.extractJSON(text);
  }

}
