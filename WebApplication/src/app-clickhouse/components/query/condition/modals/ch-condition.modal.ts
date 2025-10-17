import { Component, HostListener, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ChConditionTrComponent } from "../ch-condition-tr.component";
import { BaseChConditionComponent } from "../base/base-ch-condition.component";
import { ChConditionDto } from "../../../../dtos/condition/ch-condition.dto";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SyncButtonComponent } from "../../../../../shared/components/sync-button/sync-button.component";
import { ChOutputDto } from "../../../../dtos/output/ch-output.dto";
import { OutputAction } from "../../../../enums/output/output-action.enum";
import { QueryType } from "../../../../enums/query-type.enum";
import { ChTableDto } from "../../../../dtos/ch-table.dto";
import { TemplateSubquerySearchDto } from "../../../../../app-templates/dtos/search/template-subquery-search.dto";

@Component({
    standalone: true,
    selector: 'ch-condition-modal',
    templateUrl: './ch-condition.modal.html',
    imports: [TranslateModule, FormsModule, SyncButtonComponent, ChConditionTrComponent]
})
export class ChConditionModalComponent extends BaseChConditionComponent {

    queryType = QueryType;

    @Input() chConditions: ChConditionDto[] = [];
    @Input() normalColumnsOutput: ChOutputDto[] = [];
    @Input() outputAction: OutputAction;
    @Input() chQueryType: QueryType;
    @Input() chTable = new ChTableDto();
    @Input() chSubquery = new TemplateSubquerySearchDto();

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.decline();
    }

    constructor(
        private activeModal: NgbActiveModal
    ) {
        super();
    }

    save() {
        this.activeModal.close(this.chConditions);
    }

    decline() {
        this.activeModal.close(null);
    }
}