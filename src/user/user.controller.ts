import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    return this.userService.register(createUserDto, response);
  }

  @Get('/current')
  currentUser(@CurrentUser() user: User): object {
    return user;
  }

  @Get()
  findAll(@Res() response: Response) {
    return this.userService.findAll(response);
  }

  @Get(':id')
  findById(@Param('id') id: number, @Res() response: Response) {
    return this.userService.findById(+id, response);
  }

  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    return this.userService.update(+id, updateUserDto, response);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() response: Response) {
    return this.userService.remove(+id, response);
  }
}
