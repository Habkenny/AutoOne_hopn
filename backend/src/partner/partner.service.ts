import { Injectable, NotFoundException } from "@nestjs/common";
import { BookingStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UpsertPartnerServiceDto } from "./dto";

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { providers: { include: { services: true } } },
    });
    if (!partner) throw new NotFoundException("Partner profile not found.");

    const providerIds = partner.providers.map((provider) => provider.id);
    const bookings = await this.prisma.booking.findMany({
      where: { providerId: { in: providerIds } },
      include: { provider: true },
      orderBy: { createdAt: "desc" },
    });
    const services = partner.providers.flatMap((provider) => provider.services);
    const revenue = bookings
      .filter((booking) => booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED)
      .reduce((sum, booking) => sum + Number(booking.price), 0);

    return {
      stats: {
        totalBookings: bookings.length,
        revenue,
        activeRequests: bookings.filter((booking) => booking.status === BookingStatus.PENDING).length,
      },
      bookings: bookings.map((booking) => ({
        id: booking.id,
        customer: booking.customerName,
        service: booking.serviceType,
        providerName: booking.provider.name,
        date: booking.date.toISOString().slice(0, 10),
        time: booking.time,
        status: booking.status.toLowerCase(),
        amount: Number(booking.price),
      })),
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        price: Number(service.price),
        duration: `${service.durationMinutes} min`,
        active: service.active,
      })),
      trends: [
        { label: "Mon", value: 8 },
        { label: "Tue", value: 12 },
        { label: "Wed", value: 9 },
        { label: "Thu", value: 16 },
        { label: "Fri", value: 14 },
      ],
    };
  }

  async addService(userId: string, dto: UpsertPartnerServiceDto) {
    const provider = await this.firstPartnerProvider(userId);
    const durationMinutes = Number.parseInt(dto.duration ?? "60", 10) || 60;

    return this.prisma.providerService.create({
      data: {
        providerId: provider.id,
        name: dto.name,
        price: dto.price,
        durationMinutes,
      },
    });
  }

  async updateService(userId: string, id: string, dto: UpsertPartnerServiceDto) {
    const provider = await this.firstPartnerProvider(userId);
    await this.prisma.providerService.findFirstOrThrow({ where: { id, providerId: provider.id } });

    return this.prisma.providerService.update({
      where: { id },
      data: {
        name: dto.name,
        price: dto.price,
        durationMinutes: Number.parseInt(dto.duration ?? "60", 10) || 60,
      },
    });
  }

  private async firstPartnerProvider(userId: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { userId },
      include: { providers: { take: 1 } },
    });
    const provider = partner?.providers[0];
    if (!provider) throw new NotFoundException("Partner provider not found.");
    return provider;
  }
}
