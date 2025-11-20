import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni kategori oluştur' })
  @ApiResponse({ status: 201, description: 'Kategori başarıyla oluşturuldu' })
  @ApiResponse({ status: 409, description: 'Kategori zaten mevcut' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kategorileri listele' })
  @ApiResponse({ status: 200, description: 'Kategori listesi' })
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kategori detayını getir' })
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiResponse({ status: 200, description: 'Kategori detayı' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kategori güncelle' })
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiResponse({ status: 200, description: 'Kategori güncellendi' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kategori sil' })
  @ApiParam({ name: 'id', description: 'Kategori ID' })
  @ApiResponse({ status: 200, description: 'Kategori silindi' })
  @ApiResponse({ status: 404, description: 'Kategori bulunamadı' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return { message: 'Kategori başarıyla silindi' };
  }
}

