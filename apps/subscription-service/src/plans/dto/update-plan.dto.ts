import { IsString, IsNumber, IsArray, IsInt } from "class-validator";

export class UpdatePlanDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsArray()
    @IsString({ each: true })
    features: string[];

    @IsInt()
    duration: number;
}
