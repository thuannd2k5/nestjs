import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";


export class CreateRoleDto {
    @IsNotEmpty({ message: "name is not empty" })
    name: string;

    @IsNotEmpty({ message: "description is not empty" })
    description: string;

    @IsNotEmpty({ message: "isActive is not empty" })
    @IsBoolean({ message: "isActive có dạng là boolean" })
    isActive: boolean;

    @IsNotEmpty({ message: "permissions is not empty" })
    @IsMongoId({ each: true, message: "each permission la mongo object id" })
    @IsArray({ message: "permissions có dạng là array" })
    permissions: mongoose.Schema.Types.ObjectId[];
}
