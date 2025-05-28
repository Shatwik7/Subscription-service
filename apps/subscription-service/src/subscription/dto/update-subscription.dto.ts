import { IsDateString, IsEnum, IsNumber, IsOptional } from "class-validator";

export class UpdateSubscriptionDto {
  @IsNumber()
  @IsOptional()
  planId: number;

  @IsDateString()
  @IsOptional()
  endDate: string;


  @IsEnum(['active', 'inactive', 'cancelled', 'expired'])
  @IsOptional()
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
}
