import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { addTFASecretDto } from '../dto';

@Injectable()
export class PrismaTFAService {
  constructor(private prisma: PrismaService) {}

  async updateTFASecret(dto: addTFASecretDto): Promise<User> {

    return this.prisma.user
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

  async getTFASecret(intraId: number) {

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

}
