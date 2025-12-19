import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { LlmService } from 'src/llm/llm.service';
import { Types } from 'mongoose';

@Injectable()
export class ChatAiService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: SoftDeleteModel<ConversationDocument>,

    @InjectModel(Message.name)
    private messageModel: SoftDeleteModel<MessageDocument>,

    private llmService: LlmService,
  ) { }

  async getOrCreateConversation(user: {
    _id: Types.ObjectId;
    email: string;
  }) {
    //Tìm conversation đang ACTIVE
    let conversation = await this.conversationModel.findOne({
      userId: user._id,
      status: 'ACTIVE',
      type: 'CAREER_ADVISOR',
    });

    //Nếu chưa có → tạo mới
    if (!conversation) {
      conversation = await this.conversationModel.create({
        userId: user._id,
        type: 'CAREER_ADVISOR',
        status: 'ACTIVE',
        context: {
          intent: 'career_guidance',
          goal: 'Tư vấn định hướng nghề nghiệp IT',
        },
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });
    }

    return conversation;
  }


  async saveUserMessage(
    conversationId: Types.ObjectId,
    user: {
      _id: Types.ObjectId;
      email: string;
    },
    content: string,
  ) {
    return this.messageModel.create({
      conversationId,
      role: 'user',
      content,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }


  async getConversationHistory(conversationId: string) {
    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return messages
      .slice(-10) // 🔥 CHỈ 10 MESSAGE GẦN NHẤT
      .map(m => ({
        role: m.role,
        message: m.content,
      }));
  }


  async sendMessage(
    user: {
      _id: Types.ObjectId;
      email: string;
    },
    content: string,
  ) {
    // Lấy hoặc tạo conversation
    const conversation = await this.getOrCreateConversation(user);

    // Lưu message user
    await this.saveUserMessage(conversation._id, user, content);

    // Lấy history
    const history = await this.getConversationHistory(
      conversation._id.toString(),
    );

    // Gọi AI
    let aiResult;

    try {
      aiResult = await this.llmService.careerChat(
        history,
        content,
        conversation.context,
      );
    } catch (error) {
      aiResult = {
        reply: 'Hiện hệ thống đang quá tải, bạn vui lòng thử lại sau.',
        analysis: [],
        follow_up_questions: [],
      };
    }


    // Lưu message AI
    await this.messageModel.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: aiResult.reply,
    });

    return aiResult;
  }

  // Lấy lịch sử chat của user
  async getUserChatHistory(user: {
    _id: Types.ObjectId;
  }) {
    // Lấy conversation đang ACTIVE
    const conversation = await this.conversationModel.findOne({
      userId: user._id,
      status: 'ACTIVE',
      type: 'CAREER_ADVISOR',
    });

    if (!conversation) return [];

    // Lấy messages
    const messages = await this.messageModel
      .find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    // Map cho frontend
    return messages.map(m => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    }));
  }

}
