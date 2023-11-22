import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(createUserDto: CreateUserDto, response: Response) {
    try {
      // Fazemos o hash da senha para criar o novo usuário
      const data = {
        ...createUserDto,
        google_uid: await bcrypt.hash(createUserDto.google_uid, 12),
      };

      const createdUser = await this.prisma.user.create({ data });

      // Retornamos o status como 201
      response.status(HttpStatus.CREATED).json({
        ...createdUser,
        google_uid: undefined,
      });
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async findAll(response: Response) {
    try {
      // Buscamos todos os usuários ativos
      const users = await this.prisma.user.findMany({
        where: {
          status: 'active',
        },
        select: {
          id: true,
          name: true,
          email: true,
          google_uid: false,
          phone: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!users) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhum usuário cadastrado',
        });
      }

      // Retornamos status 200
      response.status(HttpStatus.OK).json(users);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  // Função utilizada pela auth service
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user;
  }

  async findById(id: number, response: Response) {
    try {
      // Buscamos o usuário pelo id
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          google_uid: false,
          phone: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado',
        });
      }

      // Retornamos status 200
      response.status(HttpStatus.OK).json(user);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, response: Response) {
    try {
      // Buscamos o usuário em questão para saber se ele existe
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado',
        });
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      // Retornamos o status 202 junto com os dados atualizados
      response.status(HttpStatus.ACCEPTED).json({
        ...updatedUser,
        google_uid: undefined,
      });
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async remove(id: number, response: Response) {
    try {
      // Buscamos o usuário em questão para saber se ele existe e se ja não esta desativado
      const user = await this.prisma.user.findUnique({
        where: { id, NOT: [{ status: 'disable' }] },
      });

      if (!user) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Usuário não encontrado ou ja desativado!',
        });
      }

      // Atualizamos o status para desativado
      const disableUser = await this.prisma.user.update({
        where: { id },
        data: { status: 'disable' },
      });

      // Retornamos o status 202 e os dados desativados
      response.status(HttpStatus.ACCEPTED).json({
        ...disableUser,
        google_uid: undefined,
      });
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
