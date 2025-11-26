import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsObject, ValidateNested } from "class-validator";
import mongoose from "mongoose";


export class CreateResumeDto {

    @IsNotEmpty({ message: "email khong duoc bo trong" })
    email: string;

    @IsNotEmpty({ message: "userId khong duoc bo trong" })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "url khong duoc bo trong" })
    url: string;

    @IsNotEmpty({ message: "status khong duoc bo trong" })
    status: string;

    @IsNotEmpty({ message: "companyId khong duoc bo trong" })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "jobId khong duoc bo trong" })
    jobId: mongoose.Schema.Types.ObjectId;

}

export class CreateUserCvDto {

    @IsNotEmpty({ message: "url khong duoc bo trong" })
    url: string;

    @IsNotEmpty({ message: "companyId khong duoc bo trong" })
    @IsMongoId({ message: "companyId is a mongo id" })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "jobId khong duoc bo trong" })
    @IsMongoId({ message: "jobId is a mongo id" })
    jobId: mongoose.Schema.Types.ObjectId;

}
