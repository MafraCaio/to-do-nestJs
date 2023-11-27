import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  Patch,
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
  create(
    @Body() createToDoDto: CreateToDoDto,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    return this.toDoService.create(createToDoDto, user.id, response);
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
    @Body() updateToDoDto: UpdateToDoDto,
    @Res() response: Response,
  ) {
    return this.toDoService.update(+id, updateToDoDto, response);
  }

  @Patch('/order')
  updateOrder(
    @Body() newOrders: { taskId: number; order: number }[],
    @Res() response: Response,
  ) {
    return this.toDoService.updateTasksOrder(newOrders, response);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    return this.toDoService.remove(+id, response);
  }
}
