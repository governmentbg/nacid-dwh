import { FilterPropDto } from "../../shared/filter-dtos/filter-prop.dto";
import { TemplateAccessLevel } from "../enums/template-access-level.enum";

export class TemplateGroupFilterDto extends FilterPropDto {
    name: string;
    accessLevel: TemplateAccessLevel;

    override limit = 10;
}