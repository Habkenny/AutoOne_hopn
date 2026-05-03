import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpsertPartnerServiceDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  duration?: string;
}
