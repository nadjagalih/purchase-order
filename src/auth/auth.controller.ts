import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  loginPage(@Req() req: Request, @Res() res: Response) {
    if (req.session?.userId) return res.redirect('/');
    return res.render('auth/login', { title: 'Login Admin', error: null });
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Login Admin',
        error: 'Email atau password tidak sesuai.',
      });
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    return res.redirect('/');
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => res.redirect('/login'));
  }
}
