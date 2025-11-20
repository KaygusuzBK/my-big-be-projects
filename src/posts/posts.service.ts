import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId,
      published: createPostDto.published ?? false,
    });

    if (createPostDto.categoryIds && createPostDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findBy({
        id: In(createPostDto.categoryIds),
      });
      post.categories = categories;
    }

    return this.postsRepository.save(post);
  }

  async findAll(published?: boolean): Promise<Post[]> {
    const where = published !== undefined ? { published } : {};
    return this.postsRepository.find({
      where,
      relations: ['author', 'categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'categories'],
    });

    if (!post) {
      throw new NotFoundException('Post bulunamadı');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string): Promise<Post> {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('Sadece kendi postlarınızı güncelleyebilirsiniz');
    }

    if (updatePostDto.categoryIds) {
      const categories = await this.categoriesRepository.findBy({
        id: In(updatePostDto.categoryIds),
      });
      post.categories = categories;
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('Sadece kendi postlarınızı silebilirsiniz');
    }

    await this.postsRepository.remove(post);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.postsRepository.increment({ id }, 'viewCount', 1);
  }
}

