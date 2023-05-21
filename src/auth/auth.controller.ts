import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.id,
    );
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUpUser(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() loginDto: SignInDto, @Request() req) {
    return await this.authService.signInUser(req.user.id, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async signOut(@Request() req) {
    await this.signOut(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testJwt(@Request() req) {
    return req.user;
  }
}
