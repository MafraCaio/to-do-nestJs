import { Response } from 'express';
import { UserService } from './../user/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/user.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      // Buscamos o usuário com base no email informado no login
      const user = await this.userService.findByEmail(email);

      if (user) {
        // Realizamos a comparação da senha criptografada
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          return {
            ...user,
            password: undefined,
          };
        }
      }

      return new Error('Endereço de email ou senha informado está incorreto!');
    } catch (error) {
      return error;
    }
  }

  login(user: User, response: Response) {
    try {
      // Transformar o user em um JWT - Transform the user into a JWT
      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      const jwtToken = this.jwtService.sign(payload);

      response.status(HttpStatus.OK).json({ access_token: jwtToken });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
