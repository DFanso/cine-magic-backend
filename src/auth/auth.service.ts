import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signJwt(user: any): Promise<string> {
    if (!user || !user.email || !user._id) {
      throw new Error('Invalid user data for JWT signing.');
    }
    const payload = { username: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async signUp(userDetails: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findOne({
      email: userDetails.email,
    });
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }
    const user = await this.usersService.create(userDetails);
    return user;
  }

  async signIn(signInDto: LoginDto): Promise<string | null> {
    const user = await this.usersService.findOne({
      email: signInDto.email,
    });
    if (!user) {
      return null;
    }
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
