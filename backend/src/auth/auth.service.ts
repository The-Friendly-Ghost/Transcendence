import { JwtService } from '@nestjs/jwt';
import { PrismaUserService } from 'src/user/prisma/prismaUser.service';
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { authDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(
        private readonly prismaUserService: PrismaUserService,
        private readonly jwtService: JwtService,
        private prisma: PrismaService,
      ) {}
    async test_login(dto: authDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                name: dto.name,
            }
        })
        if (!user)
            throw new ForbiddenException('user does not exist');

        if (user.password != dto.password)
        throw new ForbiddenException('password incorrect');
        return "logged in with" + dto.name;
    }

    async test_signup(dto: authDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    intraId:    dto.intraId,
                    password:   dto.password,
                    name:       dto.name,
                },
            });
            return "signing up";
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError)
            {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Fields are duplacates.');
                }
            }
            throw error;
        }
    }

    async validateUser(intraId: number, name: string): Promise<any> {
      console.log('AuthService.validateUser');
      console.log('intraId: ', intraId);
      console.log('name: ', name);

      const password = "jewhfernvkjxc";
    
      // Do some stuff to add the user to the database if needed
      const user = await this.prismaUserService.findOrCreateUser({ intraId, name, password });
    
      console.log('AuthService.validateUser returning user:', user);
      return name;
    }
    
    async login(intraId: number, name: string): Promise<{ access_token: string }> {
      console.log('AuthService.signToken');
    
      const payload = { intraId: intraId, name: name };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '8h',
        secret: process.env.JWT_SECRET,
      });
    
      console.log('AuthService.signToken returning token');
      return { access_token: token };
    }
    callback() {
        console.log(authDto);
        return ("returned callback")
    }
}
 