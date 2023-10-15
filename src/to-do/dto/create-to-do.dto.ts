import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  title: string;

  @IsString()
  @MaxLength(250)
  description: string;

  @IsInt()
  categories_id: number;

  @IsString()
  @MaxLength(100)
  priority: string;

  @IsString()
  @MaxLength(250)
  comments: string;
}
