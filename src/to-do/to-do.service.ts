import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class ToDoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToDoDto: CreateToDoDto, user_id, response: Response) {
    try {
      // Recebemos os dados do Dto e inserimos
      const firstOrderTask = await this.prisma.tasks.findFirst({
        where: { user_id: user_id },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      createToDoDto.order = (firstOrderTask?.order ?? 0) + 1;

      const data = {
        ...createToDoDto,
      };

      const createdTask = await this.prisma.tasks.create({ data });

      // Retornamos o status como 201
      response.status(HttpStatus.CREATED).json(createdTask);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async findAll(user_id: number, response: Response) {
    try {
      // Buscamos todas as tasks do usuário com base no id dele e nas categorias das tarefas
      const pendingTasks = await this.prisma.tasks.findMany({
        where: {
          user_id: user_id,
          status: 'pending',
        },
        orderBy: {
          order: 'asc',
        },
      });

      const completedTasks = await this.prisma.tasks.findMany({
        where: {
          user_id: user_id,
          status: 'completed',
        },
      });

      // Retornamos o status como 200
      response
        .status(HttpStatus.OK)
        .json({ pendingTasks: pendingTasks, completedTasks: completedTasks });
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async findOne(id: number, response: Response) {
    try {
      // Buscamos a task com base no id fornecido
      const task = await this.prisma.tasks.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Tarefa não encontrada',
        });
      }

      // Retornamos o status como 200
      response.status(HttpStatus.OK).json(task);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async updateTasksOrder(
    newOrders: { taskId: number; order: number }[],
    response: Response,
  ) {
    try {
      await Promise.all(
        newOrders.map(({ taskId, order }) => {
          this.updateTaskOrder(taskId, order);
        }),
      );
      // Retornamos o status 202 junto com os dados atualizados
      response
        .status(HttpStatus.ACCEPTED)
        .json({ message: 'Ordem atualizada' });
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async updateTaskOrder(taskId: number, newOrder: number) {
    await this.prisma.tasks.update({
      where: { id: taskId },
      data: { order: newOrder },
    });
  }

  async update(id: number, updateToDoDto: UpdateToDoDto, response: Response) {
    try {
      // Buscamos se essa task existe antes de atualizar
      const task = await this.prisma.tasks.findFirst({
        where: {
          id,
        },
      });

      if (!task) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Tarefa não encontrada',
        });
      }

      const updatedTask = await this.prisma.tasks.update({
        where: { id },
        data: updateToDoDto,
      });

      // Retornamos o status 202 junto com os dados atualizados
      response.status(HttpStatus.ACCEPTED).json(updatedTask);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async remove(id: number, response: Response) {
    try {
      // Buscamos se essa task existe antes de apagar
      const task = await this.prisma.tasks.findFirst({
        where: {
          id,
        },
      });

      if (!task) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Tarefa não encontrada',
        });
      }

      const deletedTask = await this.prisma.tasks.delete({
        where: {
          id,
        },
      });

      // Retornamos o status 202 e os dados que foram excluídos
      response.status(HttpStatus.ACCEPTED).json(deletedTask);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
