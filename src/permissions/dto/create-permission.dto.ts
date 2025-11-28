import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: "name is not empty" })
    name: string;

    @IsNotEmpty({ message: "apiPath is not empty" })
    apiPath: string;

    @IsNotEmpty({ message: "method is not empty" })
    method: string;

    @IsNotEmpty({ message: "module is not empty" })
    module: string;
}
