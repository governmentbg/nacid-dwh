import { OrderByType } from "../../enums/order-by/order-by-type.enum";
import { ChColumnOutputDto } from "../output/ch-column-output.dto";

export class ChOrderByDto {
    orderByColumn: ChColumnOutputDto;
    orderBy: OrderByType = OrderByType.asc;
}