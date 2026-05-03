import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, UpdateProfileDto } from "./dto";

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("auth/register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    return this.attachRefreshCookie(response, await this.auth.register(dto));
  }

  @Post("auth/login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return this.attachRefreshCookie(response, await this.auth.login(dto));
  }

  @Post("auth/logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("autoone_refresh");
    return { ok: true };
  }

  @Post("auth/refresh")
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.attachRefreshCookie(response, await this.auth.refresh(request.cookies?.autoone_refresh));
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: CurrentUserPayload) {
    return this.auth.me(user.sub);
  }

  @Patch("me")
  @UseGuards(JwtAuthGuard)
  updateMe(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(user.sub, dto);
  }

  private attachRefreshCookie(response: Response, result: { refreshToken: string; accessToken: string; user: unknown }) {
    response.cookie("autoone_refresh", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }
}
