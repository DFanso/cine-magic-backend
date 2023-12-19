import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  NotFoundException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UsersService } from 'src/users/users.service';
import { ClsService } from 'nestjs-cls';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, UserType } from 'src/Types/user.types';

@ApiTags('movies')
@Controller({ path: 'movies', version: '1' })
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
    private readonly clsService: ClsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The movie has been successfully created.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async create(@Body() createMovieDto: CreateMovieDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (user.type != UserType.Admin) {
      throw new HttpException('User is not an Admin', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.moviesService.create(createMovieDto);
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the movie',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of movies retrieved successfully.',
  })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Movie retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found.',
  })
  async findOne(@Param('id') id: string) {
    const movie = await this.moviesService.findOne({ _id: id });
    if (!movie) {
      throw new NotFoundException(`Movie with ID '${id}' not found.`);
    }
    return movie;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (user.type != UserType.Admin) {
      throw new HttpException('User is not an Admin', HttpStatus.BAD_REQUEST);
    }
    const updatedMovie = await this.moviesService.update(id, updateMovieDto);
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID '${id}' not found.`);
    }
    return updatedMovie;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The movie has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Movie not found.',
  })
  async remove(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException(
        'Authentication required',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.usersService.findOne({ _id: context.user.id });
    if (user.type != UserType.Admin) {
      throw new HttpException('User is not an Admin', HttpStatus.BAD_REQUEST);
    }
    const deletedMovie = await this.moviesService.remove(id);
    if (!deletedMovie) {
      throw new NotFoundException(`Movie with ID '${id}' not found.`);
    }
    return { message: `Movie with ID '${id}' has been deleted.` };
  }
}
