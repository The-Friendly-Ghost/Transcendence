import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authDto {
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    intraId: string;
    @IsNotEmpty()
    name: string;
}