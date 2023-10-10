import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class authDto {
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    intraId: number;
    @IsNotEmpty()
    name: string;
}
