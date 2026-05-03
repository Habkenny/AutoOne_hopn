import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, RequestStatus } from "@prisma/client";
import { toFinanceOffer } from "../common/serializers";
import { PrismaService } from "../prisma/prisma.service";
import { SubmitFinanceApplicationDto } from "./dto";

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async offers() {
    const offers = await this.prisma.financeOffer.findMany({ orderBy: { interestRate: "asc" } });
    return offers.map(toFinanceOffer);
  }

  async submitApplication(customerId: string, dto: SubmitFinanceApplicationDto) {
    const financeOfferId = dto.financeOfferId ?? dto.selectedOffer?.id;
    const offer = financeOfferId
      ? await this.prisma.financeOffer.findUnique({ where: { id: financeOfferId } })
      : await this.prisma.financeOffer.findFirst({ orderBy: { interestRate: "asc" } });
    if (!offer) throw new NotFoundException("Finance offer not found.");

    const application = await this.prisma.financeApplication.create({
      data: {
        customerId,
        financeOfferId: offer.id,
        form: dto.form as Prisma.InputJsonValue,
        finance: dto.finance as Prisma.InputJsonValue,
        calculator: dto.calculator as Prisma.InputJsonValue,
        events: { create: { status: RequestStatus.SUBMITTED, note: "Application submitted." } },
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: customerId,
        type: "submitted",
        title: "Finance application submitted",
        message: `${offer.name} received your application.`,
      },
    });

    return { id: application.id, status: application.status.toLowerCase(), ...dto };
  }
}
