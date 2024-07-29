import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Public, ResponseMessage } from './decorator/customize'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @ResponseMessage('Đăng ký tài khoản thành công !')
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser)
  }

  // @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
