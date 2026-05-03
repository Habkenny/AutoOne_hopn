import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { BookingStatus, UserRole } from "@prisma/client";
import { CurrentUserPayload } from "../common/current-user.decorator";
import { toBooking, toBookingStatus } from "../common/serializers";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto, UpdateBookingStatusDto } from "./dto";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string, dto: CreateBookingDto) {
    const provider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId },
      include: { availability: true, services: true },
    });
    if (!provider) throw new NotFoundException("Provider not found.");
    if (!provider.active) throw new ConflictException("Provider is not accepting bookings.");
    if (provider.typeId !== dto.serviceType) {
      throw new BadRequestException("Service type does not match provider.");
    }

    const selectedService = dto.providerServiceId
      ? provider.services.find((service) => service.id === dto.providerServiceId && service.active)
      : provider.services.find((service) => service.active);

    if (dto.providerServiceId && !selectedService) {
      throw new BadRequestException("Provider service is invalid for this provider.");
    }

    const slot = provider.availability.find((item) => item.startTime === dto.time && item.status === "open");
    if (!slot) throw new ConflictException("Selected time slot is not available.");

    const date = new Date(dto.date);
    if (Number.isNaN(date.getTime())) throw new BadRequestException("Booking date is invalid.");

    const activeBookingsForSlot = await this.prisma.booking.count({
      where: {
        providerId: provider.id,
        date,
        time: dto.time,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (activeBookingsForSlot >= slot.capacity) {
      throw new ConflictException("Selected time slot is fully booked.");
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          customerId,
          providerId: dto.providerId,
          providerServiceId: selectedService?.id,
          serviceType: dto.serviceType,
          date,
          time: dto.time,
          customerName: dto.name,
          customerPhone: dto.phone,
          vehicleLabel: dto.car,
          notes: dto.notes,
          price: selectedService?.price ?? provider.priceFrom,
          status: BookingStatus.PENDING,
          events: { create: { actorId: customerId, toStatus: BookingStatus.PENDING, note: "Booking request created." } },
        },
        include: { provider: true },
      });

      await tx.notification.create({
        data: {
          userId: customerId,
          type: "confirmed",
          title: "Booking request sent",
          message: `${provider.name} received your booking request.`,
        },
      });

      return created;
    });

    return toBooking(booking);
  }

  async mine(customerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { customerId },
      include: { provider: true },
      orderBy: { createdAt: "desc" },
    });
    return bookings.map(toBooking);
  }

  async updateStatus(actor: CurrentUserPayload, id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id }, include: { provider: true } });
    if (!booking) throw new NotFoundException("Booking not found.");

    const nextStatus = toBookingStatus(dto.status);
    await this.assertCanUpdateStatus(actor, booking.providerId, booking.customerId, nextStatus);

    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        status: nextStatus,
        events: {
          create: {
            actorId: actor.sub,
            fromStatus: booking.status,
            toStatus: nextStatus,
            note: dto.note,
          },
        },
      },
      include: { provider: true },
    });

    await this.prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: dto.status.toLowerCase(),
        title: `Booking ${dto.status.toLowerCase()}`,
        message: `${booking.provider.name} is now ${dto.status.toLowerCase()}.`,
      },
    });

    return toBooking(updated);
  }

  private async assertCanUpdateStatus(actor: CurrentUserPayload, providerId: string, customerId: string, status: BookingStatus) {
    if (actor.role === UserRole.ADMIN) return;

    if (actor.role === UserRole.CUSTOMER) {
      if (actor.sub === customerId && status === BookingStatus.CANCELLED) return;
      throw new ForbiddenException("Customers can only cancel their own bookings.");
    }

    if (actor.role === UserRole.PARTNER) {
      const ownsProvider = await this.prisma.partner.findFirst({
        where: { userId: actor.sub, providers: { some: { id: providerId } } },
        select: { id: true },
      });
      if (ownsProvider) return;
    }

    throw new ForbiddenException("You cannot update this booking.");
  }
}
