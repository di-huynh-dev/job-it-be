import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Public, ResponseMessage, User } from './decorator/customize'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { Request, Response } from 'express'
import { IUser } from 'src/users/user.interface'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Đăng nhập thành công!')
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }

  @Public()
  @ResponseMessage('Đăng ký tài khoản thành công !')
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser)
  }

  @Get('account')
  @ResponseMessage('Lấy thông tin người dùng thành công!')
  getProfile(@User() user: IUser) {
    return { user }
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('Refresh token thành công!')
  refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.authService.renewToken(request, response)
  }
}
