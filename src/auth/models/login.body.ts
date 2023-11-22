import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsEmail()
  email: string;

  @IsString()
  google_uid: string;
}
