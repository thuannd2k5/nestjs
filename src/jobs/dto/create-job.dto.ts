import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, MinDate, ValidateNested } from "class-validator";

class Company {
    @IsNotEmpty({ message: "Company's _id is not empty" })
    _id: string

    @IsNotEmpty({ message: "Company's name is not empty" })
    name: string

    @IsNotEmpty({ message: "Company's logo is not empty" })
    logo: string
}


export class CreateJobDto {
    @IsNotEmpty({ message: "Name is not empty" })
    name: string;

    @IsArray({ message: "skills có định dạng là array" })
    @IsString({ each: true, message: "skills định dạng là string" })
    @IsNotEmpty({ message: "skills is not empty" })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;

    @IsNotEmpty({ message: "location is not empty" })
    location: string;

    @IsNotEmpty({ message: "salary is not empty" })
    salary: number;

    @IsNotEmpty({ message: "quantity is not empty" })
    quantity: number;

    @IsNotEmpty({ message: "level is not empty" })
    level: string;

    @IsNotEmpty({ message: "description is not empty" })
    description: string;

    @IsNotEmpty({ message: "startDate is not empty" })
    @Transform(({ value }) => value && new Date(value))
    @IsDate({ message: "startDate có định dạng là Date" })
    startDate: Date;

    @IsNotEmpty({ message: "endDate is not empty" })
    @Transform(({ value }) => value && new Date(value))
    @IsDate({ message: "endDate có định dạng là Date" })
    endDate: Date;

    @IsNotEmpty({ message: "isActive is not empty" })
    @IsBoolean({ message: "isActive có định dạng là boolean" })
    isActive: Boolean;
}
