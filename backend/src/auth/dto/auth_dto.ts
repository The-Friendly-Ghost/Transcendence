import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class authDto {
  @IsInt()
  intraId: number;

  @IsString()
  name: string;
}
