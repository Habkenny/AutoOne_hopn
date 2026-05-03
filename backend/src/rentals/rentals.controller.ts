import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreateRentalBookingDto } from "./dto";
import { RentalsService } from "./rentals.service";

@Controller("rentals")
export class RentalsController {
  constructor(private readonly rentals: RentalsService) {}

  @Get()
  cars(@Query() query: Record<string, string>) {
    return this.rentals.cars({
      location: query.location,
      type: query.type,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
    });
  }

  @Get(":id")
  carById(@Param("id") id: string) {
    return this.rentals.carById(id);
  }

  @Post(":id/bookings")
  @UseGuards(JwtAuthGuard)
  createBooking(
    @CurrentUser() user: CurrentUserPayload,
    @Param("id") id: string,
    @Body() dto: CreateRentalBookingDto,
  ) {
    return this.rentals.createBooking(user.sub, id, dto);
  }
}
