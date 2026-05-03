import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto, UpdateBookingStatusDto } from "./dto";

@Controller("bookings")
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.sub, dto);
  }

  @Get("me")
  mine(@CurrentUser() user: CurrentUserPayload) {
    return this.bookings.mine(user.sub);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.PARTNER, UserRole.ADMIN)
  updateStatus(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookings.updateStatus(user, id, dto);
  }
}
