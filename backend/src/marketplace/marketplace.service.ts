import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { toProvider, toServiceType } from "../common/serializers";

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async serviceTypes() {
    const types = await this.prisma.serviceType.findMany({ orderBy: { id: "asc" } });
    return types.map(toServiceType);
  }

  async providers(filters: { type?: string; location?: string; maxPrice?: number; minRating?: number; availableToday?: boolean }) {
    const providers = await this.prisma.provider.findMany({
      where: {
        active: true,
        typeId: filters.type,
        location: filters.location ? { contains: filters.location, mode: "insensitive" } : undefined,
        priceFrom: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
        rating: filters.minRating ? { gte: filters.minRating } : undefined,
        availableToday: filters.availableToday || undefined,
      },
      include: { services: true, reviews: { include: { user: true } }, availability: true },
      orderBy: [{ availableToday: "desc" }, { rating: "desc" }],
    });

    return providers.map(toProvider);
  }

  async providerById(id: string, type?: string) {
    const provider = await this.prisma.provider.findFirst({
      where: { id, typeId: type, active: true },
      include: { services: true, reviews: { include: { user: true } }, availability: true },
    });

    return provider ? toProvider(provider) : null;
  }

  async featuredProviders() {
    const providers = await this.prisma.provider.findMany({
      where: { active: true, rating: { gte: 4.7 } },
      include: { services: true, reviews: { include: { user: true } }, availability: true },
      orderBy: { rating: "desc" },
      take: 3,
    });

    return providers.map(toProvider);
  }

  async searchProviders(query = "") {
    const providers = await this.prisma.provider.findMany({
      where: query
        ? {
            active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
              { services: { some: { name: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : { active: true },
      include: { services: true, reviews: { include: { user: true } }, availability: true },
      take: 6,
    });

    return providers.map(toProvider);
  }
}
