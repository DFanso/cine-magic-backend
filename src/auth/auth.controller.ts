import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists.',
  })
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.signUp(createUserDto);
      return { user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User Already Exits');
      }
    }
    const user = await this.authService.signUp(createUserDto);
    return { user };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  async signIn(@Body() signInDto: LoginDto) {
    const token = await this.authService.signIn(signInDto);
    if (!token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { accessToken: token };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
