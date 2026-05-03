import { Controller, Get, Param, Query } from "@nestjs/common";
import { MarketplaceService } from "./marketplace.service";

@Controller()
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get("service-types")
  serviceTypes() {
    return this.marketplace.serviceTypes();
  }

  @Get("providers")
  providers(@Query() query: Record<string, string>) {
    return this.marketplace.providers({
      type: query.type,
      location: query.location,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      minRating: query.minRating ? Number(query.minRating) : undefined,
      availableToday: query.availableToday === "true",
    });
  }

  @Get("providers/featured")
  featuredProviders() {
    return this.marketplace.featuredProviders();
  }

  @Get("providers/:id")
  providerById(@Param("id") id: string, @Query("type") type?: string) {
    return this.marketplace.providerById(id, type);
  }

  @Get("search/providers")
  searchProviders(@Query("q") query?: string) {
    return this.marketplace.searchProviders(query);
  }
}
