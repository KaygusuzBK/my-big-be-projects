import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsUUID, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Başlık metin formatında olmalıdır' })
  @IsNotEmpty({ message: 'Başlık zorunludur' })
  @MinLength(3, { message: 'Başlık en az 3 karakter olmalıdır' })
  title: string;

  @IsString({ message: 'İçerik metin formatında olmalıdır' })
  @IsNotEmpty({ message: 'İçerik zorunludur' })
  @MinLength(10, { message: 'İçerik en az 10 karakter olmalıdır' })
  content: string;

  @IsString({ message: 'Özet metin formatında olmalıdır' })
  @IsOptional()
  excerpt?: string;

  @IsBoolean({ message: 'Yayınlanma durumu boolean olmalıdır' })
  @IsOptional()
  published?: boolean;

  @IsString({ message: 'Resim URL metin formatında olmalıdır' })
  @IsOptional()
  imageUrl?: string;

  @IsArray({ message: 'Kategori ID\'leri dizi formatında olmalıdır' })
  @IsUUID('4', { each: true, message: 'Her kategori ID geçerli bir UUID olmalıdır' })
  @IsOptional()
  categoryIds?: string[];
}

