import { Controller, Get, Injectable, Ip, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";
import querystring from "querystring";

import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { AuthService } from "~/app/auth/services/auth.service";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") {}

@Controller("oauth2/github")
export class GithubController {
  constructor(private readonly userRepository: UserRepo, private readonly loginService: AuthService) {}

  @Get()
  @UseGuards(GithubAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async githubAuth() {}

  @Get("callback")
  @UseGuards(GithubAuthGuard)
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ipAddr: string) {
    let user: User | any = req.user;
    console.log("JASONRAIMONDI")
    console.log({ user });
    if (!user || !user.email) {
      throw UnauthorizedException.invalidUser();
    }

    if (user! instanceof User) {
      user = await this.userRepository.findByEmail(user.email);
    }

    const token = await this.loginService.loginOauth(user);
    const rememberMe = true;
    await this.loginService.sendRefreshToken(res, rememberMe, user);

    res.redirect(`http://scratchy.localdomain:8080/callback?${querystring.stringify({ token })}`);
  }
}