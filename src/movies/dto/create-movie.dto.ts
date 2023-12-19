import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: String,
    description: 'Name of the movie',
    example: 'The Matrix',
  })
  readonly name: string;

  @IsInt()
  @ApiProperty({
    type: Number,
    description: 'Year of the movie release',
    example: 1999,
  })
  readonly year: number;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'URL to the cover image of the movie',
    example: 'http://example.com/coverimage.jpg',
  })
  readonly coverImage?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'URL to the banner image of the movie',
    example: 'http://example.com/bannerimage.jpg',
  })
  readonly bannerImage?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'URL to the movie trailer',
    example: 'http://example.com/trailer',
  })
  readonly trailer?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Start date of the movie in ISO format',
    example: '2023-12-15',
  })
  readonly startDate: string;
}
