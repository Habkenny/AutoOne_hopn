import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CreateImportRequestDto } from "./dto";
import { ImportsService } from "./imports.service";

@Controller("imports")
export class ImportsController {
  constructor(private readonly imports: ImportsService) {}

  @Get("catalog")
  catalog(@Query("region") region?: string) {
    return this.imports.catalog(region);
  }

  @Post("requests")
  @UseGuards(JwtAuthGuard)
  createRequest(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateImportRequestDto) {
    return this.imports.createRequest(user.sub, dto);
  }
}
