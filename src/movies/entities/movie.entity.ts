import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @ApiProperty({ type: String, description: 'Unique identifier for the movie' })
  @Prop({ required: true, type: Types.ObjectId })
  MovieID: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Name of the movie',
    example: 'The Matrix',
  })
  @Prop({ required: true })
  Name: string;

  @ApiProperty({
    type: String,
    description: 'Genre of the movie',
    example: 'Sci-Fi',
  })
  @Prop({ required: true })
  Genre: string;

  @ApiProperty({
    type: Number,
    description: 'Duration of the movie in minutes',
    example: 120,
  })
  @Prop({ required: true })
  Duration: number;

  @ApiProperty({ type: [String], description: 'List of cast members' })
  @Prop({ type: [String], required: true })
  Cast: string[];

  @ApiProperty({
    type: [String],
    description: 'List of image URLs for the movie',
  })
  @Prop({ type: [String] })
  Image: string[];

  @ApiProperty({
    type: String,
    description: 'URL to the movie trailer',
    example: 'http://example.com/trailer',
  })
  @Prop()
  Trailer: string;

  @ApiProperty({
    type: Date,
    description: 'Start date of the movie',
    example: '2023-12-15',
  })
  @Prop({ required: true })
  StartDate: Date;
}

const MovieSchema = SchemaFactory.createForClass(Movie);

export { MovieSchema };
