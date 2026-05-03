import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { BookingsModule } from "./bookings/bookings.module";
import { FinanceModule } from "./finance/finance.module";
import { HealthModule } from "./health/health.module";
import { ImportsModule } from "./imports/imports.module";
import { MarketplaceModule } from "./marketplace/marketplace.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PartnerModule } from "./partner/partner.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RentalsModule } from "./rentals/rentals.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MarketplaceModule,
    BookingsModule,
    PartnerModule,
    RentalsModule,
    ImportsModule,
    FinanceModule,
    NotificationsModule,
    HealthModule,
  ],
})
export class AppModule {}
