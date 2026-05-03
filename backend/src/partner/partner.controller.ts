import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { UpsertPartnerServiceDto } from "./dto";
import { PartnerService } from "./partner.service";

@Controller("partner")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PARTNER, UserRole.ADMIN)
export class PartnerController {
  constructor(private readonly partner: PartnerService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: CurrentUserPayload) {
    return this.partner.dashboard(user.sub);
  }

  @Post("services")
  addService(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpsertPartnerServiceDto) {
    return this.partner.addService(user.sub, dto);
  }

  @Patch("services/:id")
  updateService(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: UpsertPartnerServiceDto,
  ) {
    return this.partner.updateService(user.sub, id, dto);
  }
}
