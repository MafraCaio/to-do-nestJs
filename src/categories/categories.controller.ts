import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Res,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() response: Response,
  ) {
    return this.categoriesService.create(createCategoryDto, response);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Res() response: Response) {
    return this.categoriesService.findAll(user.id, response);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    return this.categoriesService.findOne(+id, user.id, response);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() response: Response,
  ) {
    return this.categoriesService.update(
      +id,
      user.id,
      updateCategoryDto,
      response,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    return this.categoriesService.remove(+id, user.id, response);
  }
}
