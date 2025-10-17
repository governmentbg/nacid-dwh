import { ChQueryDto } from "../../../app-clickhouse/dtos/ch-query.dto";

export class TemplateSubquerySearchDto {
    id: number;
    name: string;
    nameAlt: string;
    chQuery: ChQueryDto;
}