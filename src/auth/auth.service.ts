import { Response } from 'express';
import { UserService } from './../user/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/user.payload';
import { JwtService } from '@nestjs/jwt';
import admin from 'firebase-admin';

const firebaseKeys = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseKeys),
});
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

      // Implementar logica do google
      if (user) {
        const decodedToken = await admin.auth().verifyIdToken(password);

        const uid = decodedToken.uid;

        // Realizamos a comparação da senha criptografada
        const isPasswordValid = await bcrypt.compare(uid, user.google_uid);

        if (isPasswordValid) {
          return {
            ...user,
            google_uid: undefined,
          };
        }
      }

      return { status: false };
    } catch (error) {
      return error;
    }
  }

  login(user: User, response: Response) {
    try {
      // Transformar o user em um JWT - Transform the user into a JWT
      if (user.id && user.email) {
        const payload: UserPayload = {
          sub: user.id,
          email: user.email,
          name: user.name,
        };

        const jwtToken = this.jwtService.sign(payload);

        response
          .status(HttpStatus.OK)
          .json({ ...user, access_token: jwtToken });
      } else {
        response.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Endereço de email ou senha informado está incorreto',
        });
      }
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
