import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { addTFASecretDto } from '../dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PrismaTFAService {
  constructor(private prisma: PrismaService) {}

  async updateTFASecret(dto: addTFASecretDto): Promise<User> {
    return await this.prisma.user
      .update({
        data: { twoFASecret: dto.secret },
        where: { intraId: dto.intraId || undefined },
      })
      .catch((e) => {
        console.log('PrismaTFAService error reason:', e.message);
        // throw the internal prisma error
        return undefined;
      });
  }

  async getTFASecret(intraId: number): Promise<string> {
    const user: User = await this.prisma.user
      .findUnique({
        where: { intraId: intraId },
      })
      .catch((e) => {
        console.log('PrismaTFAService error reason:', e.message);
        // throw the internal prisma error
        return undefined;
      });
    return user.twoFASecret;
  }

  async toggle_tfa(intraId: number, enable_2fa: boolean): Promise<string> {
    await this.prisma.user
      .update({
        data: { twoFAEnabled: enable_2fa },
        where: { intraId: intraId },
      })
      .catch((e) => {
        console.log('PrismaTFAService error reason:', e.message);
        // throw the internal prisma error
        throw new InternalServerErrorException();
      });
      if (enable_2fa === true) {
        return "enabled 2fa";
      }
      return "disabled 2fa";
  }

  async getTwoFAEnabled(intraId: number): Promise<boolean> {
    const user: User = await this.prisma.user
      .findUnique({
        where: { intraId: intraId },
      })
      .catch((e: Prisma.PrismaClientKnownRequestError) => {
        console.error(
          'PrismaUserService.addFriend error reason: ' + e.message + ' code: ' + e.code,
        );
        throw new InternalServerErrorException();
      });
    return user.twoFAEnabled;
  }
}
