import { FilterPropDto } from "../../shared/filter-dtos/filter-prop.dto";
import { TemplateAccessLevel } from "../enums/template-access-level.enum";

export class TemplateQueryFilterDto extends FilterPropDto {
    templateGroupId: number;
    name: string;
    showAsSubquery: boolean;
    accessLevel: TemplateAccessLevel;

    override limit = 10;
}