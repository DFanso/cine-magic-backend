import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @ApiProperty({
    type: String,
    description: 'Name of the movie',
    example: 'The Matrix',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Year of the movie release',
    example: 1999,
  })
  @Prop({ required: true })
  year: number;

  @ApiProperty({
    type: String,
    description: 'URL to the cover image of the movie',
    example: 'http://example.com/coverimage.jpg',
  })
  @Prop()
  coverImage: string;

  @ApiProperty({
    type: String,
    description: 'URL to the banner image of the movie',
    example: 'http://example.com/bannerimage.jpg',
  })
  @Prop()
  bannerImage: string;

  @ApiProperty({
    type: String,
    description: 'URL to the movie trailer',
    example: 'http://example.com/trailer',
  })
  @Prop()
  trailer: string;

  @ApiProperty({
    type: Date,
    description: 'Start date of the movie in ISO format',
    example: '2023-12-15',
  })
  @Prop({ required: true })
  startDate: Date;
}

const MovieSchema = SchemaFactory.createForClass(Movie);

export { MovieSchema };
