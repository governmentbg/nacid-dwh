import { Conjuction } from "../../enums/conjuction.enum";
import { Operator } from "../../enums/operator.enum";
import { ChColumnDto } from "../output/ch-column.dto";
import { ChOutputDto } from "../output/ch-output.dto";
import { ChConditionContainDto } from "./ch-condition-contain.dto";

export class ChConditionDto {
    conjuction: Conjuction;
    hasOpeningBracket = false;
    subqueryColumn: ChOutputDto;
    column: ChColumnDto;
    operator = Operator.equalTo;
    expectedResult: string;
    hasClosingBracket = false;

    contains: ChConditionContainDto[] = [];
}