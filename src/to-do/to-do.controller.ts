import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ToDoService } from './to-do.service';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Response } from 'express';

@Controller('task')
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) {}

  @Post()
  create(@Body() createToDoDto: CreateToDoDto, @Res() response: Response) {
    return this.toDoService.create(createToDoDto, response);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Res() response: Response) {
    return this.toDoService.findAll(user.id, response);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() response: Response) {
    return this.toDoService.findOne(+id, response);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateToDoDto: UpdateToDoDto,
    @Res() response: Response,
  ) {
    return this.toDoService.update(+id, user.id, updateToDoDto, response);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    return this.toDoService.remove(+id, user.id, response);
  }
}
