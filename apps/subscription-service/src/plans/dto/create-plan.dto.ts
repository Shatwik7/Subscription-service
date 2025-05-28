import { IsArray, IsInt, IsNumber, IsString } from "class-validator";

export class CreatePlanDto {
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