import { ChColumnOutputDto } from "../output/ch-column-output.dto";

export class ChGroupByDto {
    groupByColumns: ChColumnOutputDto[] = [];

    // Client only
    autoAdded = false;
}