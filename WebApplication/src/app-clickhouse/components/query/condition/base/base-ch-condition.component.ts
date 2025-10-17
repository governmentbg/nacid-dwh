import { Directive } from "@angular/core";
import { Conjuction } from "../../../../enums/conjuction.enum";
import { ChConditionDto } from "../../../../dtos/condition/ch-condition.dto";

@Directive()
export abstract class BaseChConditionComponent {

    conjuctionEnum = Conjuction;

    openingBracketsCount = 0;
    closingBracketsCount = 0;

    calculateBrackets(chCondition: ChConditionDto[]) {
        let openOverClosedCount = 0;

        chCondition.forEach(cond => {
            if (cond.hasOpeningBracket) {
                openOverClosedCount++;
            }

            if (cond.hasClosingBracket) {
                if (openOverClosedCount > 0) {
                    openOverClosedCount--;
                } else {
                    cond.hasClosingBracket = false;
                }
            }
        });

        this.openingBracketsCount = chCondition.filter(c => c.hasOpeningBracket).length;
        this.closingBracketsCount = chCondition.filter(c => c.hasClosingBracket).length;
    }

    canCloseBracket(index: number, chCondition: ChConditionDto[]): boolean {
        let open = 0;
        let close = 0;

        for (let i = 0; i <= index; i++) {
            if (chCondition[i].hasOpeningBracket) open++;
            if (chCondition[i].hasClosingBracket) close++;
        }

        return open > close;
    }

    addCondition(conjuction: Conjuction, chConditions: ChConditionDto[]) {
        const newCondition = new ChConditionDto();
        newCondition.conjuction = conjuction;
        chConditions.push(newCondition);
    }

    removeCondition(index: number, chConditions: ChConditionDto[]) {
        chConditions.splice(index, 1);

        if (index === 0 && chConditions?.length > 0) {
            chConditions[0].conjuction = null;
        }
    }
}