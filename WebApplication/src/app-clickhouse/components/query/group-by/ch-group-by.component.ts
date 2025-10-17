import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CollapsableLabelComponent } from "../../../../shared/components/collapsable-label/collapsable-label.component";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChGroupByDto } from "../../../dtos/group-by/ch-group-by.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { AggregateFunction } from "../../../enums/output/aggregate-function.enum";
import { ChColumnOutputDto } from "../../../dtos/output/ch-column-output.dto";
import { OutputChangeService } from "../../../services/output-change.service";
import { ChGroupByTrComponent } from "./ch-group-by-tr.component";
import { ChGroupByResultComponent } from "./ch-group-by-result.component";
import { ChQueryDto } from "../../../dtos/ch-query.dto";
import { OutputAction } from "../../../enums/output/output-action.enum";

@Component({
    standalone: true,
    selector: 'ch-group-by',
    templateUrl: './ch-group-by.component.html',
    imports: [TranslateModule, CollapsableLabelComponent, FormsModule, ChGroupByTrComponent, SyncButtonComponent, ChGroupByResultComponent]
})
export class ChGroupByComponent implements OnInit {

    chGroupByPreparation = new ChGroupByDto();

    @Input() chQuery: ChQueryDto;
    @Input() chGroupBy: ChGroupByDto[] = [];
    @Output() chGroupByChange: EventEmitter<ChGroupByDto[]> = new EventEmitter<ChGroupByDto[]>();

    chOutputGrouping: ChOutputDto[] = [];

    constructor(
        private outputChangeService: OutputChangeService
    ) {
    }

    addGroupingColumn() {
        const newGroupingColumn: ChColumnOutputDto = null;
        this.chGroupByPreparation.groupByColumns.push(newGroupingColumn);
    }

    removeGroupingColumn(index: number) {
        this.chGroupByPreparation.groupByColumns.splice(index, 1);
    }

    addGroupBy() {
        this.chGroupBy.push(this.chGroupByPreparation);
        this.constructAutoGroup(true);
        this.chGroupByPreparation = new ChGroupByDto();
        this.chGroupByChange.emit(this.chGroupBy);
    }

    removeGroupBy(index: number) {
        this.chGroupBy.splice(index, 1);
        this.constructAutoGroup(false);
        this.chGroupByChange.emit(this.chGroupBy);
    }

    private constructAutoGroup(isAdd: boolean) {
        if (isAdd || this.chGroupBy.length > 1) {
            this.chGroupBy = this.chGroupBy.filter(e => !e.autoAdded);

            const includedColumns = [...new Set(this.chGroupBy.flatMap(e => e.groupByColumns.map(s => s.columnAs)))];
            const missingNonAggregateOutputs = this.chOutputGrouping.filter(e => !includedColumns.includes(e.columnAs));

            if (missingNonAggregateOutputs.length > 0) {
                const defaultGroupingSet = new ChGroupByDto();
                defaultGroupingSet.autoAdded = true;
                defaultGroupingSet.groupByColumns = missingNonAggregateOutputs;
                this.chGroupBy.push(defaultGroupingSet);
            }
        } else {
            this.chGroupBy = [];
        }
    }

    private constructGroupByOnOutputChange() {
        const ouputColumnAsArray = this.chOutputGrouping.map(e => e.columnAs);
        this.chGroupBy = this.chGroupBy.filter(e => e.groupByColumns.every(s => ouputColumnAsArray.includes(s.columnAs)));

        if (this.chGroupBy.filter(e => !e.autoAdded).length > 0) {
            this.constructAutoGroup(true);
        } else {
            this.chGroupBy = [];
        }

        this.chGroupByChange.emit(this.chGroupBy);
    }

    ngOnInit() {
        this.outputChangeService
            .subscribe((value: ChOutputDto[]) => {
                this.chGroupByPreparation = new ChGroupByDto();

                this.chOutputGrouping = value.filter(e => e.outputAction === OutputAction.columnAdd && e.aggregateFunction === AggregateFunction.none);
                this.constructGroupByOnOutputChange();
            });
    }
}
