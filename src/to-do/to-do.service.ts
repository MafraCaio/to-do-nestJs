import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateToDoDto } from './dto/create-to-do.dto';
import { UpdateToDoDto } from './dto/update-to-do.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class ToDoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createToDoDto: CreateToDoDto, response: Response) {
    try {
      // Recebemos os dados do Dto e inserimos
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

      if (!tasks) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Sem tarefas cadastradas',
        });
      }

      // Retornamos o status como 200
      response.status(HttpStatus.OK).json(tasks);
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

  async update(
    id: number,
    user_id: number,
    updateToDoDto: UpdateToDoDto,
    response: Response,
  ) {
    try {
      // Buscamos se essa task existe antes de atualizar
      const task = await this.prisma.tasks.findFirst({
        where: {
          id,
          categories: {
            user_id: user_id,
          },
        },
        include: {
          categories: true,
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

  async remove(id: number, user_id: number, response: Response) {
    try {
      // Buscamos se essa task existe antes de apagar
      const task = await this.prisma.tasks.findFirst({
        where: {
          id,
          categories: {
            user_id: user_id,
          },
        },
        include: {
          categories: true,
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
