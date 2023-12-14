import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsEmail } from 'class-validator';
import { UserType, UserStatus } from 'src/Types/user.types';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'The avatar URL of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: UserType.Customer,
    enum: UserType,
    description: 'The type of the user',
    default: UserType.Customer,
  })
  @IsEnum(UserType)
  type: UserType = UserType.Customer;

  @ApiProperty({
    example: UserStatus.Unverified,
    enum: UserStatus,
    description: 'The status of the user account',
    default: UserStatus.Unverified,
  })
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.Unverified;

  // Add other properties as necessary
}
