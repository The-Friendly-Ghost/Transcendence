import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authDto {
    @IsNotEmpty()
    name: string;
    intaId: string;
    favouriteNumber: number;
    password: string;
}