import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'FirstName', description: 'first Name' })
  firstName: string;

  @ApiProperty({ example: 'LastName', description: 'last Name' })
  lastName: string;

  @ApiProperty({
    example: 'password',
    description: 'The password',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address',
    // You can also add format validation here if needed
  })
  @IsString()
  email: string;

  // other properties
}
