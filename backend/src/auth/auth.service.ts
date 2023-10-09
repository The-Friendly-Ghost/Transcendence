import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { authDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}
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

    callback() {
        console.log(authDto);
        return ("returned callback")
    }
}
 