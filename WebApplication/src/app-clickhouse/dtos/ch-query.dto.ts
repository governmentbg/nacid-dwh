import { TemplateSubquerySearchDto } from "../../app-templates/dtos/search/template-subquery-search.dto";
import { QueryType } from "../enums/query-type.enum";
import { ChPaginationDto } from "./ch-pagination.dto";
import { ChTableDto } from "./ch-table.dto";
import { ChConditionDto } from "./condition/ch-condition.dto";
import { ChGroupByDto } from "./group-by/ch-group-by.dto";
import { ChOrderByDto } from "./order-by/ch-order-by.dto";
import { ChOutputDto } from "./output/ch-output.dto";

export class ChQueryDto {
    queryType = QueryType.fromTable;
    table: ChTableDto;
    subquery: TemplateSubquerySearchDto;
    pagination = new ChPaginationDto();
    output: ChOutputDto[] = [];
    condition: ChConditionDto[] = [];
    groupBy: ChGroupByDto[] = [];
    orderBy: ChOrderByDto[] = [];
}