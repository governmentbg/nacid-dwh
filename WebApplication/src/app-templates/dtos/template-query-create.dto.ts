import { ChQueryDto } from "../../app-clickhouse/dtos/ch-query.dto";
import { TemplateQueryDto } from "./template-query.dto";

export class TemplateQueryCreateDto {
    templateQuery: TemplateQueryDto = new TemplateQueryDto();
    chQuery: ChQueryDto;
}