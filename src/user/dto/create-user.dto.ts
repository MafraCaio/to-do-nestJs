import { User } from '../entities/user.entity';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto extends User {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(120)
  google_uid: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  name: string;

  @IsString()
  @MaxLength(20)
  phone: string;
}
