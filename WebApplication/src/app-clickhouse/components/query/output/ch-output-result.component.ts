import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { ChOutputSelectStringModal } from "./../modals/ch-output-select-string.modal";
import { AggregateFunction } from "../../../enums/output/aggregate-function.enum";
import { ClickStopPropagation } from "../../../../shared/directives/click-stop-propagation.directive";
import { QueryType } from "../../../enums/query-type.enum";
import { OutputAction } from "../../../enums/output/output-action.enum";
import { Configuration } from "../../../../app/configuration/configuration";
import { ChConditionModalComponent } from "../condition/modals/ch-condition.modal";
import { ChConditionDto } from "../../../dtos/condition/ch-condition.dto";
import { ChTableDto } from "../../../dtos/ch-table.dto";
import { TemplateSubquerySearchDto } from "../../../../app-templates/dtos/search/template-subquery-search.dto";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    standalone: true,
    selector: 'ch-output-result',
    templateUrl: './ch-output-result.component.html',
    imports: [TranslateModule, SyncButtonComponent, ClickStopPropagation, NgbTooltip, DragDropModule]
})
export class ChOutputResultComponent {

    outputAction = OutputAction;
    aggregateFunction = AggregateFunction;

    @Input() chQueryType: QueryType;
    @Input() chOutput: ChOutputDto[] = [];
    @Input() normalColumnsOutput: ChOutputDto[] = [];
    @Input() chTable = new ChTableDto();
    @Input() chSubquery = new TemplateSubquerySearchDto();
    @Output() triggerRemoveOutput: EventEmitter<ChOutputDto> = new EventEmitter<ChOutputDto>();

    constructor(
        public configuration: Configuration,
        private modalService: NgbModal,
        private queryResource: ChQueryResource
    ) {
    }

    removeOutput(index: number, output: ChOutputDto) {
        this.chOutput.splice(index, 1);
        this.triggerRemoveOutput.emit(output);
    }

    openEditConditionModal(index: number) {
        const modal = this.modalService.open(ChConditionModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.chConditions = JSON.parse(JSON.stringify(this.chOutput[index].conditions)) as ChConditionDto[];
        modal.componentInstance.normalColumnsOutput = this.normalColumnsOutput;
        modal.componentInstance.outputAction = this.chOutput[index].outputAction;
        modal.componentInstance.chQueryType = this.chQueryType;
        modal.componentInstance.chTable = this.chTable;
        modal.componentInstance.chSubquery = this.chSubquery;

        return modal.result.then((updatedConditions: ChConditionDto[]) => {
            if (updatedConditions) {
                this.chOutput[index].conditions = JSON.parse(JSON.stringify(updatedConditions)) as ChConditionDto[];

                this.queryResource.getSingleSelect(this.chQueryType, this.chOutput[index])
                    .pipe(
                        catchError((err: HttpErrorResponse) => {
                            return throwError(() => err);
                        })
                    )
                    .subscribe(rawSelect => {
                        this.chOutput[index].rawSelect = rawSelect;
                    });
            }
        });
    }

    openSelectModal() {
        const modal = this.modalService.open(ChOutputSelectStringModal, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.chQueryType = this.chQueryType;
        modal.componentInstance.chOutput = this.chOutput;
    }

    drop(event: CdkDragDrop<ChOutputDto[]>) {
        if (event.previousIndex !== event.currentIndex) {
            const movedItem = this.chOutput.splice(event.previousIndex, 1)[0];
            this.chOutput.splice(event.currentIndex, 0, movedItem);
        }
    }
}
