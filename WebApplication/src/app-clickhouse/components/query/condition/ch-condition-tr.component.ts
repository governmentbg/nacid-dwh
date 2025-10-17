import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ChConditionDto } from "../../../dtos/condition/ch-condition.dto";
import { Conjuction } from "../../../enums/conjuction.enum";
import { NomenclatureSelectComponent } from "../../../../shared/components/nomenclature-select/nomenclature-select.component";
import { EnumSelectComponent } from "../../../../shared/components/enum-select/enum-select.component";
import { Operator } from "../../../enums/operator.enum";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { AutoDetectInputComponent } from "../../../../shared/components/auto-detect-input/auto-detect-input.component";
import { ChConditionContainDto } from "../../../dtos/condition/ch-condition-contain.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";
import { ChColumnDto } from "../../../dtos/output/ch-column.dto";
import { QueryType } from "../../../enums/query-type.enum";
import { AggregateFunction } from "../../../enums/output/aggregate-function.enum";
import { OutputAction } from "../../../enums/output/output-action.enum";
import { Configuration } from "../../../../app/configuration/configuration";
import { ColumnVisualization } from "../../../../shared/enums/column-visualization.enum";

@Component({
    standalone: true,
    selector: 'tr[ch-condition-tr]',
    templateUrl: './ch-condition-tr.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [TranslateModule, FormsModule, NomenclatureSelectComponent, EnumSelectComponent, SyncButtonComponent, AutoDetectInputComponent, ArraySelectComponent]
})
export class ChConditionTrComponent {

    queryType = QueryType;
    conjuctionEnum = Conjuction;
    operatorEnum = Operator;
    outputActionEnum = OutputAction;
    aggregateFunction = AggregateFunction;
    excludeOperators: Operator[] = [];
    columnVisualizationText = this.configuration.columnVisualization === ColumnVisualization.full ? '{comment}, {name} {type}' : '{comment} {type}';

    normalColumnsOutputColumns: ChColumnDto[];
    @Input('normalColumnsOutput')
    set normalColumnsOutputSetter(normalColumnsOutput: ChOutputDto[]) {
        this.normalColumnsOutputColumns = normalColumnsOutput.map(e => e.column);
    }

    @Input() canRemoveFirstElement = false;
    @Input() outputAction = OutputAction.columnAdd;
    @Input() condition = new ChConditionDto();
    @Input() index: number;
    @Input() chQueryType: QueryType;
    @Input() chSubqueryOutputs: ChOutputDto[] = [];
    @Input() tableName: string;
    @Input() openingBracketsCount = 0;
    @Input() closingBracketsCount = 0;
    @Input() canCloseBracket: boolean;

    @Output() hasBracketsChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() triggerRemove: EventEmitter<void> = new EventEmitter<void>();

    constructor(private configuration: Configuration) {
    }

    hasBracketChange() {
        this.hasBracketsChange.emit();
    }

    columnChanged(columnType: string) {
        this.condition.expectedResult = null;
        this.condition.operator = Operator.equalTo;
        this.condition.contains = [];

        const columnTypeToLower = columnType?.toLowerCase();

        if (columnTypeToLower?.includes('string')) {
            this.excludeOperators = [];
        } else {
            this.excludeOperators = [Operator.like, Operator.notLike, Operator.empty, Operator.notEmpty];
        }
    }

    operatorChanged() {
        if (this.condition.operator === this.operatorEnum.in || this.condition.operator === this.operatorEnum.notIn) {
            this.condition.contains = [new ChConditionContainDto()];
        } else {
            this.condition.contains = [];
        }

        this.condition.expectedResult = null;
    }

    remove() {
        this.hasBracketsChange.emit();
        this.triggerRemove.emit();
    }

    addContain() {
        this.condition.contains.push(new ChConditionContainDto());
    }

    removeContain(index: number) {
        this.condition.contains.splice(index, 1);
    }
}