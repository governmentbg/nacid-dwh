import { TemplateAccessLevel } from "../enums/template-access-level.enum";
import { TemplateGroupDto } from "./template-group.dto";

export class TemplateQueryDto {
    id: number;

    templateGroupId: number;
    templateGroup: TemplateGroupDto;

    name: string;
    nameAlt: string;

    description: string;
    descriptionAlt: string;

    showAsSubquery = false;
    jsonQuery: string;
    rawQuery: string;

    accessLevel = TemplateAccessLevel.public;
}