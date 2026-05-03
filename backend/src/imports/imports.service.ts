import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { toImportCar, toImportRegion } from "../common/serializers";
import { CreateImportRequestDto } from "./dto";

@Injectable()
export class ImportsService {
  constructor(private readonly prisma: PrismaService) {}

  async catalog(region = "EU") {
    const [regions, cars] = await Promise.all([
      this.prisma.importRegion.findMany({ orderBy: { label: "asc" } }),
      this.prisma.importCar.findMany({ where: { regionId: region } }),
    ]);

    return {
      regions: regions.map(toImportRegion),
      cars: cars.map(toImportCar),
    };
  }

  async createRequest(customerId: string, dto: CreateImportRequestDto) {
    const request = await this.prisma.importRequest.create({
      data: {
        customerId,
        regionId: dto.region,
        carId: dto.carId,
        destination: dto.destination,
        costs: dto.costs as Prisma.InputJsonValue,
        events: {
          create: [{ label: "Ordered", completedAt: new Date() }, { label: "Shipped" }, { label: "Customs" }, { label: "Delivered" }],
        },
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: customerId,
        type: "submitted",
        title: "Import request submitted",
        message: "AutoOne received your import request.",
      },
    });

    return { id: request.id, status: request.status.toLowerCase(), ...dto };
  }
}
