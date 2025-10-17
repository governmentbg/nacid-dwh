import { FilterPropDto } from "../../../shared/filter-dtos/filter-prop.dto";
import { Verb } from "../../enums/verb.enum";

export class ActionLogFilterDto extends FilterPropDto {
    ip: string;
    url: string;
    verb: Verb;
    userId: number;
    logDate: Date;

    // Client only
    user: any;
}