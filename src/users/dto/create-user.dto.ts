import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
    @IsNotEmpty({ message: 'Email adresi zorunludur' })
    email: string;

    @IsString({ message: 'Şifre metin formatında olmalıdır' })
    @IsNotEmpty({ message: 'Şifre zorunludur' })
    @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
    password: string;

    @IsString({ message: 'Ad metin formatında olmalıdır' })
    @IsNotEmpty({ message: 'Ad zorunludur' })
    firstName: string;

    @IsString({ message: 'Soyad metin formatında olmalıdır' })
    @IsNotEmpty({ message: 'Soyad zorunludur' })
    lastName: string;
}
