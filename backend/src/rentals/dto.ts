import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRentalBookingDto {
  @IsString()
  carId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @IsString({ each: true })
  extras: string[];

  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
