import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ShowTimesService } from './show-times.service';
import { CreateShowTimeDto } from './dto/create-show-time.dto';
import { UpdateShowTimeDto } from './dto/update-show-time.dto';

@ApiTags('show-times')
@Controller({ path: 'movies/:movieId/show-times', version: '1' })
export class ShowTimesController {
  constructor(private readonly showTimesService: ShowTimesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new show time for a movie' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The show time has been successfully created.',
    type: CreateShowTimeDto,
  })
  @ApiParam({ name: 'movieId', type: 'string' })
  @ApiBody({ type: CreateShowTimeDto })
  create(
    @Param('movieId') movieId: string,
    @Body() createShowTimeDto: CreateShowTimeDto,
  ) {
    createShowTimeDto.movieId = movieId;
    return this.showTimesService.create(createShowTimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all show times for a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of show times for the movie',
    type: [CreateShowTimeDto],
  })
  @ApiParam({ name: 'movieId', type: 'string' })
  findAll(@Param('movieId') movieId: string) {
    return this.showTimesService.findAll(movieId);
  }

  @Get(':showTimeId')
  @ApiOperation({ summary: 'Get a show time by id for a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Show time details',
    type: CreateShowTimeDto,
  })
  @ApiParam({ name: 'movieId', type: 'string' })
  @ApiParam({ name: 'showTimeId', type: 'string' })
  findOne(
    @Param('movieId') movieId: string,
    @Param('showTimeId') showTimeId: string,
  ) {
    return this.showTimesService.findOne({ movieId, _id: showTimeId });
  }

  @Patch(':showTimeId')
  @ApiOperation({ summary: 'Update a show time for a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The show time has been successfully updated.',
  })
  @ApiParam({ name: 'movieId', type: 'string' })
  @ApiParam({ name: 'showTimeId', type: 'string' })
  @ApiBody({ type: UpdateShowTimeDto })
  update(
    @Param('movieId') movieId: string,
    @Param('showTimeId') showTimeId: string,
    @Body() updateShowTimeDto: UpdateShowTimeDto,
  ) {
    return this.showTimesService.update(showTimeId, updateShowTimeDto);
  }

  @Delete(':showTimeId')
  @ApiOperation({ summary: 'Delete a show time for a movie' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The show time has been successfully deleted.',
  })
  @ApiParam({ name: 'movieId', type: 'string' })
  @ApiParam({ name: 'showTimeId', type: 'string' })
  remove(
    @Param('movieId') movieId: string,
    @Param('showTimeId') showTimeId: string,
  ) {
    return this.showTimesService.remove(movieId, showTimeId);
  }
}
