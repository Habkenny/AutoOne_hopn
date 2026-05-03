import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser, CurrentUserPayload } from "../common/current-user.decorator";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  mine(@CurrentUser() user: CurrentUserPayload) {
    return this.notifications.mine(user.sub);
  }

  @Patch(":id/read")
  markRead(@CurrentUser() user: CurrentUserPayload, @Param("id") id: string) {
    return this.notifications.markRead(user.sub, id);
  }

  @Patch("read-all")
  markAllRead(@CurrentUser() user: CurrentUserPayload) {
    return this.notifications.markAllRead(user.sub);
  }
}
