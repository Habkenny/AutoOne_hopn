import { IsObject, IsOptional, IsString } from "class-validator";

export class SubmitFinanceApplicationDto {
  @IsObject()
  form: Record<string, unknown>;

  @IsObject()
  finance: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  selectedOffer?: { id?: string };

  @IsObject()
  calculator: Record<string, unknown>;

  @IsOptional()
  @IsString()
  financeOfferId?: string;
}
