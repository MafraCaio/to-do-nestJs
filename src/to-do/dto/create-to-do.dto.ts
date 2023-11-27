import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  title: string;

  @IsInt()
  user_id: number;

  @IsString()
  @MaxLength(250)
  description: string;

  @IsString()
  @MaxLength(100)
  priority: string;

  @IsString()
  @MaxLength(250)
  comments: string;

  @IsInt()
  order: number;

  @IsString()
  status: string;
}
