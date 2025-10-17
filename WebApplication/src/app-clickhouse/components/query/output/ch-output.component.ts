import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CollapsableLabelComponent } from "../../../../shared/components/collapsable-label/collapsable-label.component";
import { ChTableDto } from "../../../dtos/ch-table.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { NomenclatureSelectComponent } from "../../../../shared/components/nomenclature-select/nomenclature-select.component";
import { FormsModule } from "@angular/forms";
import { AggregateFunction } from "../../../enums/output/aggregate-function.enum";
import { EnumSelectComponent } from "../../../../shared/components/enum-select/enum-select.component";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChOutputResultComponent } from "./ch-output-result.component";
import { CustomRegexDirective } from "../../../../shared/directives/validation/custom-regex.directive";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ChConditionDto } from "../../../dtos/condition/ch-condition.dto";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";
import { ChPartitionOverColumnComponent } from "./ch-partition-over-column.component";
import { ChConditionTrComponent } from "../condition/ch-condition-tr.component";
import { OutputChangeService } from "../../../services/output-change.service";
import { NoWhitespacesDirective } from "../../../../shared/directives/validation/no-whitespaces.directive";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { QueryType } from "../../../enums/query-type.enum";
import { TemplateSubquerySearchDto } from "../../../../app-templates/dtos/search/template-subquery-search.dto";
import { OutputAction } from "../../../enums/output/output-action.enum";
import { ChSumColumnComponent } from "./ch-sum-column.component";
import { ColumnVisualization } from "../../../../shared/enums/column-visualization.enum";
import { Configuration } from "../../../../app/configuration/configuration";
import { ChOutputColumnListModalComponent } from "./modals/ch-output-column-list.modal";
import { ChColumnDto } from "../../../dtos/output/ch-column.dto";
import { BaseChConditionComponent } from "../condition/base/base-ch-condition.component";
import { AlertMessageService } from "../../../../shared/components/alert-message/services/alert-message.service";
import { AlertMessageDto } from "../../../../shared/components/alert-message/models/alert-message.dto";

@Component({
    standalone: true,
    selector: 'ch-output',
    templateUrl: './ch-output.component.html',
    imports: [TranslateModule, CollapsableLabelComponent, NomenclatureSelectComponent, FormsModule, EnumSelectComponent, SyncButtonComponent,
        ChOutputResultComponent, CustomRegexDirective, NgbTooltip, ChConditionTrComponent, ArraySelectComponent, ChPartitionOverColumnComponent, ChSumColumnComponent, NoWhitespacesDirective]
})
export class ChOutputComponent extends BaseChConditionComponent {

    queryType = QueryType;
    outputAction = OutputAction;
    aggregateFunction = AggregateFunction;
    normalColumnsOutput: ChOutputDto[] = [];
    sumColumnsOutput: ChOutputDto[] = [];
    excludeOutputActions: OutputAction[] = [this.outputAction.partitionBy, this.outputAction.sumSelectedColumns];
    excludeAggregateFunctions: AggregateFunction[] = [];
    columnVisualizationText = this.configuration.columnVisualization === ColumnVisualization.full ? '{comment}, {name} {type}' : '{comment} {type}';

    @Input() chQueryType: QueryType;
    @Input() chTable = new ChTableDto();
    @Input() chSubquery = new TemplateSubquerySearchDto();

    chOutput: ChOutputDto[];
    @Input('chOutput')
    set chOutputSetter(chOutput: ChOutputDto[]) {
        this.chOutput = chOutput;
        this.setUsingColumnsOutputs();
        this.constructExcludeOutputActions();
    }

    chOutputPreparation = new ChOutputDto();

    constructor(
        private configuration: Configuration,
        private outputChangeService: OutputChangeService,
        private queryResource: ChQueryResource,
        private modalService: NgbModal,
        private alertMessageService: AlertMessageService
    ) {
        super();
    }

    chColumnChange(aggregateFunction: AggregateFunction, partitionBy: boolean, columnType: string) {
        this.chOutputPreparation.aggregateFunction = aggregateFunction;
        this.chOutputPreparation.columnAs = null;
        this.chOutputPreparation.conditions = [];

        this.setColumnName();

        this.excludeAggregateFunctionsBySelectedColumn(partitionBy, columnType);
    }

    outputActionChange() {
        this.chOutputPreparation.partitionOverColumns = [];
        this.chOutputPreparation.sumColumns = [];

        if (this.chOutputPreparation.outputAction === this.outputAction.partitionBy) {
            this.chOutputPreparation.aggregateFunction = AggregateFunction.count
            this.excludeAggregateFunctions = [AggregateFunction.none];
            this.chOutputPreparation.partitionOverColumns.push(null);
        } else {
            this.chOutputPreparation.aggregateFunction = AggregateFunction.none
            this.excludeAggregateFunctions = [];

            if (this.chOutputPreparation.outputAction === this.outputAction.sumSelectedColumns) {
                this.chOutputPreparation.sumColumns.push(null);
            }
        }

        this.chOutputPreparation.column = null;
        this.chOutputPreparation.partitionByColumn = null;
        this.chOutputPreparation.columnAs = null;
        this.chOutputPreparation.conditions = [];
    }

    excludeAggregateFunctionsBySelectedColumn(partitionBy: boolean, columnType: string) {
        const columnTypeToLower = columnType?.toLowerCase();

        if (columnTypeToLower?.includes('string') || columnTypeToLower?.includes('date')) {
            this.excludeAggregateFunctions = [AggregateFunction.sum, AggregateFunction.sumIf, AggregateFunction.avg, AggregateFunction.avgIf];
        } else {
            this.excludeAggregateFunctions = [];
        }

        if (partitionBy) {
            this.excludeAggregateFunctions.push(AggregateFunction.none);
        }
    }

    clearConditions() {
        this.chOutputPreparation.conditions = [];

        if (this.chOutputPreparation.aggregateFunction === AggregateFunction.countIf
            || this.chOutputPreparation.aggregateFunction === AggregateFunction.countDistinctIf
            || this.chOutputPreparation.aggregateFunction === AggregateFunction.minIf
            || this.chOutputPreparation.aggregateFunction === AggregateFunction.maxIf
            || this.chOutputPreparation.aggregateFunction === AggregateFunction.sumIf
            || this.chOutputPreparation.aggregateFunction === AggregateFunction.avgIf) {
            this.chOutputPreparation.conditions.push(new ChConditionDto());
        }
    }

    addPartitionOverColumns() {
        this.chOutputPreparation.partitionOverColumns.push(null);
    }

    addSumSelectedColumns() {
        this.chOutputPreparation.sumColumns.push(null);
    }

    removePartitionOverColumn(index: number) {
        this.chOutputPreparation.partitionOverColumns.splice(index, 1);
    }

    removeSumColumn(index: number) {
        this.chOutputPreparation.sumColumns.splice(index, 1);
    }

    addOutput() {
        if (this.checkIfColumnNameExist()) {
            const alertMessage = new AlertMessageDto('errorTexts.ClickHouse_Existing_Column_Name');
            this.alertMessageService.show(alertMessage);
        } else {
            if (!this.chOutputPreparation.columnAs && this.chOutputPreparation.aggregateFunction === AggregateFunction.none) {
                this.chOutputPreparation.columnAs = (this.chOutputPreparation?.partitionByColumn?.columnAs
                    ?? (this.chQueryType === this.queryType.fromTable
                        ? this.chOutputPreparation.column.comment
                        : this.chOutputPreparation.subqueryColumn.columnAs));
            }

            this.queryResource.getSingleSelect(this.chQueryType, this.chOutputPreparation)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.chOutputPreparation = new ChOutputDto();
                        return throwError(() => err);
                    })
                )
                .subscribe(rawSelect => {
                    this.chOutputPreparation.rawSelect = rawSelect;
                    this.chOutput.push(this.chOutputPreparation);
                    this.chOutputPreparation = new ChOutputDto();
                    this.outputChangeService.next(this.chOutput);
                    this.setUsingColumnsOutputs();
                    this.constructExcludeOutputActions();
                });
        }
    }

    setUsingColumnsOutputs() {
        this.normalColumnsOutput = this.chOutput.filter(e => e.outputAction === this.outputAction.columnAdd);
        this.sumColumnsOutput = this.chOutput.filter(e =>
            e.aggregateFunction === this.aggregateFunction.avg
            || e.aggregateFunction === this.aggregateFunction.avgIf
            || e.aggregateFunction === this.aggregateFunction.count
            || e.aggregateFunction === this.aggregateFunction.countDistinct
            || e.aggregateFunction === this.aggregateFunction.countDistinctIf
            || e.aggregateFunction === this.aggregateFunction.countIf
            || e.aggregateFunction === this.aggregateFunction.sum
            || e.aggregateFunction === this.aggregateFunction.sumIf
            || e.outputAction === this.outputAction.partitionBy
            || e.outputAction === this.outputAction.sumSelectedColumns
            || e.column?.type?.toLowerCase()?.includes('int'));
    }

    removedOutput(chOutputRemoved: ChOutputDto) {
        this.chOutputPreparation = new ChOutputDto();
        this.chOutput = this.chOutput
            .filter(e => e.partitionByColumn?.columnAs !== chOutputRemoved.columnAs
                && e.partitionOverColumns.every(s => s.columnAs != chOutputRemoved.columnAs)
                && e.sumColumns.every(s => s.columnAs != chOutputRemoved.columnAs));
        this.outputChangeService.next(this.chOutput);
        this.setUsingColumnsOutputs();
        this.constructExcludeOutputActions();
    }

    openColumnListModal() {
        const modal = this.modalService.open(ChOutputColumnListModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.table = this.chTable.name;

        return modal.result.then((selectedColumnDto: ChColumnDto) => {
            if (selectedColumnDto) {
                this.chOutputPreparation.column = selectedColumnDto;
                this.chColumnChange(this.aggregateFunction.none, false, this.chOutputPreparation?.column?.type)
            }
        });
    }

    private constructExcludeOutputActions() {
        this.excludeOutputActions =
            [this.normalColumnsOutput.length < 1 ? this.outputAction.partitionBy : null,
            this.sumColumnsOutput.length < 1 ? this.outputAction.sumSelectedColumns : null]
    }

    private setColumnName() {
        if (this.chQueryType === this.queryType.fromTable) {
            if (this.chOutputPreparation?.column?.comment) {
                if (this.chOutputPreparation?.column?.comment.includes("#desc") || this.chOutputPreparation?.column?.comment.includes("#asc")) {
                    this.chOutputPreparation.column.comment = this.chOutputPreparation?.column?.comment.substring(0, this.chOutputPreparation?.column?.comment.indexOf("#"));
                }

                this.chOutputPreparation.columnAs = this.chOutputPreparation?.column?.comment;
            }
        } else if (this.chQueryType === this.queryType.fromSubquery) {
            if (this.chOutputPreparation.subqueryColumn) {
                if (this.chOutputPreparation.subqueryColumn.columnAs) {
                    this.chOutputPreparation.columnAs = this.chOutputPreparation.subqueryColumn.columnAs;
                } else if (this.chOutputPreparation.subqueryColumn.column) {
                    if (this.chOutputPreparation.subqueryColumn.column.comment.includes("#desc") || this.chOutputPreparation.subqueryColumn.column.comment.includes("#asc")) {
                        this.chOutputPreparation.subqueryColumn.column.comment = this.chOutputPreparation.subqueryColumn.column.comment.substring(0, this.chOutputPreparation.subqueryColumn.column.comment.indexOf("#"))
                    }

                    this.chOutputPreparation.columnAs = this.chOutputPreparation.subqueryColumn.column.comment;
                }
            }
        }
    }

    private checkIfColumnNameExist(): boolean {
        let existColumnName = false;

        this.chOutput.forEach(chOutput => {
            if (this.chOutputPreparation.columnAs) {
                if (chOutput?.columnAs == this.chOutputPreparation.columnAs || chOutput?.column?.name == this.chOutputPreparation.columnAs) {
                    existColumnName = true;
                }
            } else if (chOutput?.columnAs == this.chOutputPreparation.column.name || chOutput?.column?.name == this.chOutputPreparation.column.name) {
                existColumnName = true;
            }
        });

        return existColumnName;
    }
}