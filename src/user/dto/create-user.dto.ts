import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto extends User {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(60)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha muito fraca',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(250)
  name: string;

  @IsString()
  @MaxLength(250)
  surname: string;

  @IsString()
  @MaxLength(20)
  phone: string;
}
