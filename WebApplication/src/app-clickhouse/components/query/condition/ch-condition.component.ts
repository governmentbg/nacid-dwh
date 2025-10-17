import { Component, Input, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CollapsableLabelComponent } from "../../../../shared/components/collapsable-label/collapsable-label.component";
import { ChTableDto } from "../../../dtos/ch-table.dto";
import { ChConditionDto } from "../../../dtos/condition/ch-condition.dto";
import { FormsModule, NgForm } from "@angular/forms";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChConditionTrComponent } from "./ch-condition-tr.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChConditionWhereStringModal } from "../modals/ch-condition-where-string.modal";
import { QueryType } from "../../../enums/query-type.enum";
import { TemplateSubquerySearchDto } from "../../../../app-templates/dtos/search/template-subquery-search.dto";
import { BaseChConditionComponent } from "./base/base-ch-condition.component";

@Component({
  standalone: true,
  selector: 'ch-condition',
  templateUrl: './ch-condition.component.html',
  imports: [TranslateModule, CollapsableLabelComponent, FormsModule, SyncButtonComponent, ChConditionTrComponent]
})
export class ChConditionComponent extends BaseChConditionComponent {

  queryType = QueryType;

  @ViewChild(NgForm) chConditionForm: NgForm;

  @Input() chQueryType: QueryType;
  @Input() chSubquery = new TemplateSubquerySearchDto();
  @Input() chTable = new ChTableDto();
  @Input() chCondition: ChConditionDto[] = [];

  constructor(
    private modalService: NgbModal
  ) {
    super();
  }

  openWhereModal() {
    const modal = this.modalService.open(ChConditionWhereStringModal, { backdrop: 'static', size: 'lg', keyboard: false });
    modal.componentInstance.chQueryType = this.chQueryType;
    modal.componentInstance.chCondition = this.chCondition;
  }
}