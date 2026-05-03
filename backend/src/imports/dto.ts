import { IsObject, IsString } from "class-validator";

export class CreateImportRequestDto {
  @IsString()
  region: string;

  @IsString()
  carId: string;

  @IsString()
  destination: string;

  @IsObject()
  costs: Record<string, unknown>;
}
