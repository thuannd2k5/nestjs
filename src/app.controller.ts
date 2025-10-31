import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('home')
  handleHomePage() {
    const message = this.appService.getHello();

    return { message };
  }

  @Get('abc')
  getHello1(): string {
    return "this.appService.getHello()";
  }

}
