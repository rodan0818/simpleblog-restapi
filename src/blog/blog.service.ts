import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}
  findAll() {
    return this.blogRepository.find();
  }
  async findOne(id: number) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog #${id} not found`);
    }
    return blog;
  }
  create(createBlogDto: CreateBlogDto) {
    const blog = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blog);
  }
  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogRepository.preload({
      id: +id,
      ...updateBlogDto,
    });
    if (!blog) {
      throw new NotFoundException(`Blog #${id} not found`);
    }
    return this.blogRepository.save(blog);
  }
  async remove(id: number) {
    const blog = await this.findOne(id);
    return this.blogRepository.remove(blog);
  }
}