import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { StringValue } from "ms";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { toPublicUser } from "../common/serializers";
import { LoginDto, RegisterDto, UpdateProfileDto } from "./dto";
import { getJwtSecret } from "./jwt-config";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException("Email is already registered.");

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        passwordHash: await bcrypt.hash(dto.password, 12),
        role: UserRole.CUSTOMER,
      },
    });

    return this.withTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException("Invalid email or password.");

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException("Invalid email or password.");

    return this.withTokens(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return toPublicUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
      if (existing && existing.id !== userId) throw new ConflictException("Email is already registered.");
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        email: dto.email?.toLowerCase(),
      },
    });
    return toPublicUser(user);
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException("Refresh token is missing.");

    try {
      const payload = await this.jwt.verifyAsync<{ sub: string }>(refreshToken, {
        secret: getJwtSecret(this.config, "JWT_REFRESH_SECRET"),
      });
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
      return this.withTokens(user);
    } catch {
      throw new UnauthorizedException("Refresh token is invalid.");
    }
  }

  private async withTokens(user: { id: string; email: string; role: UserRole; name: string; phone: string | null; language: string; currency: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: getJwtSecret(this.config, "JWT_SECRET"),
      expiresIn: (this.config.get<string>("JWT_EXPIRES_IN") ?? "15m") as StringValue,
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: getJwtSecret(this.config, "JWT_REFRESH_SECRET"),
      expiresIn: (this.config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d") as StringValue,
    });

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    };
  }
}
