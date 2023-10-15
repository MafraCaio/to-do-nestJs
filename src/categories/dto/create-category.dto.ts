import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(250)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  description: string;

  @IsInt()
  user_id: number;

  @IsString()
  status: string;
}
