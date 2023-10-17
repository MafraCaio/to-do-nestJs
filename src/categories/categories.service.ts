import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, response: Response) {
    try {
      // Recebemos os dados do Dto e inserimos
      const data = {
        ...createCategoryDto,
      };

      const createdCategory = await this.prisma.categories.create({ data });

      // Retornamos o status como 201
      response.status(HttpStatus.CREATED).json(createdCategory);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async findAll(user_id: number, response: Response) {
    try {
      const categories = await this.prisma.categories.findMany({
        where: {
          user_id: user_id,
        },
      });

      if (!categories) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Sem categorias cadastradas',
        });
      }

      // Retornamos o status como 200
      response.status(HttpStatus.OK).json(categories);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async findOne(id: number, user_id: number, response: Response) {
    try {
      const category = await this.prisma.categories.findMany({
        where: {
          id: id,
          user_id: user_id,
        },
      });

      if (!category) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Categoria não encontrada',
        });
      }

      // Retornamos o status como 200
      response.status(HttpStatus.OK).json(category);
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
    updateCategoryDto: UpdateCategoryDto,
    response: Response,
  ) {
    try {
      // Buscamos se essa categoria existe antes de apagar
      const category = await this.prisma.categories.findUnique({
        where: { id, user_id: user_id },
      });

      if (!category) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Categoria não encontrada',
        });
      }

      const updatedCategory = await this.prisma.categories.update({
        where: { id, user_id: user_id },
        data: updateCategoryDto,
      });

      // Retornamos o status como 202
      response.status(HttpStatus.ACCEPTED).json(updatedCategory);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }

  async remove(id: number, user_id: number, response: Response) {
    try {
      // Buscamos se essa categoria existe antes de apagar
      const category = await this.prisma.categories.findUnique({
        where: { id, user_id: user_id },
      });

      if (!category) {
        // Caso não tenhamos resultado retornamos erro 404
        response.status(HttpStatus.NOT_FOUND).json({
          message: 'Categoria não encontrada',
        });
      }

      const deletedCategory = await this.prisma.categories.delete({
        where: { id, user_id: user_id },
      });

      // Retornamos o status como 202
      response.status(HttpStatus.ACCEPTED).json(deletedCategory);
    } catch (error) {
      // Em caso de erro retornamos erro 500
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error,
      });
    }
  }
}
