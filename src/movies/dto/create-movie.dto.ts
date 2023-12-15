import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

export class CreateMovieDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Unique identifier for the movie' })
  readonly MovieID: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    type: String,
    description: 'Name of the movie',
    example: 'The Matrix',
  })
  readonly Name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty({
    type: String,
    description: 'Genre of the movie',
    example: 'Sci-Fi',
  })
  readonly Genre: string;

  @IsInt()
  @Min(1)
  @ApiProperty({
    type: Number,
    description: 'Duration of the movie in minutes',
    example: 120,
  })
  readonly Duration: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
    description: 'List of cast members',
    example: ['Actor A', 'Actor B'],
  })
  readonly Cast: string[];

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  @ApiProperty({
    type: [String],
    description: 'List of image URLs for the movie',
    example: ['http://example.com/image1.jpg'],
  })
  readonly Image?: string[];

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'URL to the movie trailer',
    example: 'http://example.com/trailer',
  })
  readonly Trailer?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Start date of the movie in ISO format',
    example: '2023-12-15',
  })
  readonly StartDate: string;
}
