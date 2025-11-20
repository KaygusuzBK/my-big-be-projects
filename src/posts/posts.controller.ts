import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni post oluştur' })
  @ApiResponse({ status: 201, description: 'Post başarıyla oluşturuldu' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm postları listele' })
  @ApiQuery({ name: 'published', required: false, type: Boolean, description: 'Sadece yayınlananları getir' })
  @ApiResponse({ status: 200, description: 'Post listesi' })
  async findAll(@Query('published') published?: string) {
    const publishedBool = published === 'true' ? true : published === 'false' ? false : undefined;
    return this.postsService.findAll(publishedBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Post detayını getir' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post detayı' })
  @ApiResponse({ status: 404, description: 'Post bulunamadı' })
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    await this.postsService.incrementViewCount(id);
    return post;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Post güncelle' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post güncellendi' })
  @ApiResponse({ status: 403, description: 'Yetkisiz işlem' })
  @ApiResponse({ status: 404, description: 'Post bulunamadı' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    return this.postsService.update(id, updatePostDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Post sil' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post silindi' })
  @ApiResponse({ status: 403, description: 'Yetkisiz işlem' })
  @ApiResponse({ status: 404, description: 'Post bulunamadı' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.postsService.remove(id, req.user.userId);
    return { message: 'Post başarıyla silindi' };
  }
}

