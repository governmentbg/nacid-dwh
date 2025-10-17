import { ErrorLogType } from "../enums/error-log-type.enum";
import { BaseLogDto } from "./base/base-log.dto";

export class ErrorLogDto extends BaseLogDto {
    type: ErrorLogType;
    message: string;
}