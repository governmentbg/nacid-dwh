import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { BaseLogModalComponent } from "./base/base-log-modal.componen";
import { ErrorLogType } from "../../enums/error-log-type.enum";
import { LogsResource } from "../../log.resource";
import { ErrorLogDto } from "../../dtos/error-log.dto";
import { ErrorLogFilterDto } from "../../dtos/filters/error-log-filter.dto";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { CommonModule } from "@angular/common";
import { CollapsableLabelComponent } from "../../../shared/components/collapsable-label/collapsable-label.component";
import { TranslateEnumComponent } from "../../../shared/components/translate-enum/translate-enum.component";

@Component({
    standalone: true,
    selector: 'error-log-modal',
    templateUrl: './error-log-modal.component.html',
    providers: [LogsResource],
    imports: [TranslateModule, SyncButtonComponent, CommonModule, CollapsableLabelComponent, TranslateEnumComponent]
})
export class ErrorLogModalComponent extends BaseLogModalComponent<ErrorLogDto, ErrorLogFilterDto> {

    errorLogType = ErrorLogType;

    constructor(
        protected override resource: LogsResource<ErrorLogDto, ErrorLogFilterDto>,
        protected override activeModal: NgbActiveModal
    ) {
        super(resource, activeModal, 'errors');
    }
}