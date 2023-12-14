import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OtpCode } from './entities/otpCode.entity';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatus } from 'src/Types/user.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(OtpCode.name) private readonly otpCodeModel: Model<OtpCode>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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

  async generateOtp(userId: string): Promise<any> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

    const otpCode = new this.otpCodeModel({
      userId,
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60000), // Set expiration time (5 minutes)
    });
    await otpCode.save();

    const user = await this.usersService.findOne({ _id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const emailHtml = await this.emailService.renderTemplate(
      'verify-code.hbs',
      {
        code: otp,
        user: user,
      },
    );

    try {
      await this.emailService.sendEmail(
        [user.email],
        'Your OTP Code',
        emailHtml,
      );
    } catch (error) {
      throw new BadRequestException('Email could not be sent');
    }

    return HttpStatus.OK;
  }

  async validateOtp(userId: string, otp: string): Promise<boolean> {
    try {
      const otpCode = await this.otpCodeModel.findOne({
        userId,
        code: otp,
        expiresAt: { $gt: new Date() },
      });
      if (!otpCode) {
        throw new HttpException(
          'OTP code is invalid or has expired',
          HttpStatus.BAD_REQUEST,
        );
      }
      await otpCode.deleteOne();
      const user = await this.usersService.findOne({ _id: userId });
      if (user) {
        user.status = UserStatus.Verified;
        await user.save();
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return true;
    } catch (error) {
      throw new HttpException(
        'Error in OTP validation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
