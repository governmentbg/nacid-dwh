import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LogsResource } from "../../log.resource";
import { ActionLogDto } from "../../dtos/action-log.dto";
import { ActionLogFilterDto } from "../../dtos/filters/action-log-filter.dto";
import { BaseLogModalComponent } from "./base/base-log-modal.componen";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { CommonModule } from "@angular/common";
import { CollapsableLabelComponent } from "../../../shared/components/collapsable-label/collapsable-label.component";
@Component({
    standalone: true,
    selector: 'action-log-modal',
    templateUrl: './action-log-modal.component.html',
    providers: [LogsResource],
    imports: [TranslateModule, SyncButtonComponent, CommonModule, CollapsableLabelComponent]

})
export class ActionLogModalComponent extends BaseLogModalComponent<ActionLogDto, ActionLogFilterDto> {

    constructor(
        protected override resource: LogsResource<ActionLogDto, ActionLogFilterDto>,
        protected override activeModal: NgbActiveModal
    ) {
        super(resource, activeModal, 'actions');
    }
}