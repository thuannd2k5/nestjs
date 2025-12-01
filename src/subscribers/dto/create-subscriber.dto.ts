import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {

    @IsNotEmpty({ message: "Name is not empty" })
    name: string

    @IsNotEmpty({ message: "Email is not empty" })
    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "Skills không được bỏ trống" })
    @IsString({ each: true, message: "Skills có định dạng là string" })
    @IsArray({ message: "Skill có định dạng là array" })
    skills: string[]
}
