import { Injectable } from '@nestjs/common';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToDoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToDoDto: CreateToDoDto) {
    const data = {
      ...createToDoDto,
    };

    const createdTask = await this.prisma.tasks.create({ data });

    return { ...createdTask };
  }

  async findAll(user_id: number) {
    const tasks = await this.prisma.tasks.findMany({
      where: {
        categories: {
          user_id: user_id,
        },
      },
      include: {
        categories: true,
      },
    });

    return tasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.tasks.findMany({
      where: {
        id: id,
      },
    });

    return task;
  }

  async update(id: number, updateToDoDto: UpdateToDoDto) {
    const updatedTask = await this.prisma.tasks.update({
      where: { id },
      data: updateToDoDto,
    });

    return updatedTask;
  }

  async remove(id: number) {
    const deletedTask = await this.prisma.tasks.delete({
      where: {
        id,
      },
    });

    return deletedTask;
  }
}
