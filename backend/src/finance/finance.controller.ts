import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { FinanceService } from "./finance.service";
import { SubmitFinanceApplicationDto } from "./dto";

@Controller("finance")
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get("offers")
  offers() {
    return this.finance.offers();
  }

  @Post("applications")
  @UseGuards(JwtAuthGuard)
  submitApplication(@CurrentUser() user: CurrentUserPayload, @Body() dto: SubmitFinanceApplicationDto) {
    return this.finance.submitApplication(user.sub, dto);
  }
}
