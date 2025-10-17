import { TemplateAccessLevel } from "../../enums/template-access-level.enum";

export class TemplateGroupSearchDto {
    id: number;
    name: string;
    nameAlt: string;
    description: string;
    descriptionAlt: string;
    accessLevel: TemplateAccessLevel;
    templateQueryCount: number;
}