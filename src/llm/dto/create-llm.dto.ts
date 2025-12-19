import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export class CreateLlmDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    captions: string[];
}
