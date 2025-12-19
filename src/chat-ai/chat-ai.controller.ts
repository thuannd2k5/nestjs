import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatAiService } from './chat-ai.service';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';

@Controller('chat-ai')
export class ChatAiController {
  constructor(private readonly chatAiService: ChatAiService) { }

  @Post('chat')
  @ResponseMessage("Chat AI response sent successfully")
  @SkipCheckPermission()
  async chat(
    @User() user,
    @Body() body: { message: string },
  ) {
    return this.chatAiService.sendMessage(user, body.message);
  }

}
