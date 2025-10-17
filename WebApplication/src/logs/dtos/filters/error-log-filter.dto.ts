import { FilterPropDto } from "../../../shared/filter-dtos/filter-prop.dto";
import { ErrorLogType } from "../../enums/error-log-type.enum";
import { Verb } from "../../enums/verb.enum";

export class ErrorLogFilterDto extends FilterPropDto {
    ip: string;
    url: string;
    verb: Verb;
    userId: number;
    errorLogType: ErrorLogType;
    logDate: Date;

    // Client only
    user: any;
}