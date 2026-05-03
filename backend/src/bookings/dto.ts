import { BookingStatus } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  providerServiceId?: string;

  @IsString()
  serviceType: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  car: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBookingStatusDto {
  @Transform(({ value }) => String(value).toUpperCase())
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
