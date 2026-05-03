import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { toRentalCar } from "../common/serializers";
import { CreateRentalBookingDto } from "./dto";

const MS_PER_DAY = 86_400_000;
const rentalExtraPrices = {
  insurance: 18,
  gps: 7,
  "child-seat": 6,
};

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async cars(filters: { location?: string; type?: string; maxPrice?: number }) {
    const cars = await this.prisma.rentalCar.findMany({
      where: {
        location: filters.location ? { contains: filters.location, mode: "insensitive" } : undefined,
        type: filters.type && filters.type !== "all" ? filters.type : undefined,
        pricePerDay: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
      },
      orderBy: { rating: "desc" },
    });
    return cars.map(toRentalCar);
  }

  async carById(id: string) {
    const car = await this.prisma.rentalCar.findUnique({ where: { id } });
    return car ? toRentalCar(car) : null;
  }

  async createBooking(customerId: string, id: string, dto: CreateRentalBookingDto) {
    const car = await this.prisma.rentalCar.findUnique({ where: { id } });
    if (!car) throw new NotFoundException("Rental car not found.");
    if (!car.available) throw new ConflictException("Rental car is not currently available.");

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const days = getRentalDays(startDate, endDate);
    const extras = dto.extras ?? [];
    const total = calculateRentalTotal(Number(car.pricePerDay), Number(car.deposit), days, extras);

    const overlappingBooking = await this.prisma.rentalBooking.findFirst({
      where: {
        rentalCarId: id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
      select: { id: true },
    });

    if (overlappingBooking) {
      throw new ConflictException("Rental car is already booked for those dates.");
    }

    const booking = await this.prisma.$transaction(async (tx) => {
      const created = await tx.rentalBooking.create({
        data: {
          customerId,
          rentalCarId: id,
          startDate,
          endDate,
          extras,
          total,
        },
      });

      await tx.notification.create({
        data: {
          userId: customerId,
          type: "confirmed",
          title: "Rental request sent",
          message: `${car.model} rental request was submitted.`,
        },
      });

      return created;
    });

    return {
      id: booking.id,
      status: booking.status.toLowerCase(),
      ...dto,
      carId: id,
      total,
    };
  }
}

export function getRentalDays(startDate: Date, endDate: Date) {
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new BadRequestException("Rental dates are invalid.");
  }

  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
  if (days < 1) {
    throw new BadRequestException("Return date must be after pickup date.");
  }

  return days;
}

export function calculateRentalTotal(pricePerDay: number, deposit: number, days: number, extras: string[]) {
  const extrasTotal = extras.reduce((sum, extraId) => {
    const price = rentalExtraPrices[extraId as keyof typeof rentalExtraPrices];
    if (price === undefined) {
      throw new BadRequestException(`Unsupported rental extra: ${extraId}`);
    }
    return sum + price * days;
  }, 0);

  return pricePerDay * days + extrasTotal + deposit;
}
