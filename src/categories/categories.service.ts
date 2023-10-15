import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = {
      ...createCategoryDto,
    };

    const createdCategory = await this.prisma.categories.create({ data });

    return { ...createdCategory };
  }

  async findAll(user_id: number) {
    const categories = await this.prisma.categories.findMany({
      where: {
        user_id: user_id,
      },
    });

    return categories;
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findMany({
      where: {
        id: id,
      },
    });

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const updatedCategory = await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });

    return updatedCategory;
  }

  async remove(id: number) {
    const deletedCategory = await this.prisma.categories.delete({
      where: {
        id,
      },
    });

    return deletedCategory;
  }
}
