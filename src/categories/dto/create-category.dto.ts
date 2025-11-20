import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Kategori adı metin formatında olmalıdır' })
  @IsNotEmpty({ message: 'Kategori adı zorunludur' })
  @MinLength(2, { message: 'Kategori adı en az 2 karakter olmalıdır' })
  name: string;

  @IsString({ message: 'Slug metin formatında olmalıdır' })
  @IsOptional()
  slug?: string;

  @IsString({ message: 'Açıklama metin formatında olmalıdır' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Renk metin formatında olmalıdır' })
  @IsOptional()
  color?: string;
}

