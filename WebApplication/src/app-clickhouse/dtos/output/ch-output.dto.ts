import { AggregateFunction } from "../../enums/output/aggregate-function.enum";
import { ChColumnOutputDto } from "./ch-column-output.dto";
import { ChConditionDto } from "../condition/ch-condition.dto";
import { OutputAction } from "../../enums/output/output-action.enum";

export class ChOutputDto extends ChColumnOutputDto {
    subqueryColumn: ChOutputDto;

    outputAction = OutputAction.columnAdd;
    partitionByColumn: ChOutputDto;
    partitionOverColumns: ChColumnOutputDto[] = [];
    sumColumns: ChColumnOutputDto[] = [];
    aggregateFunction = AggregateFunction.none;

    conditions: ChConditionDto[] = [];

    // Client only
    rawSelect: string;
}