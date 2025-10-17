import { Component } from "@angular/core";
import { LogsResource } from "../log.resource";
import { BaseLogSearchComponent } from "./base/base-log-search.component";
import { ActionLogDto } from "../dtos/action-log.dto";
import { ActionLogFilterDto } from "../dtos/filters/action-log-filter.dto";
import { Verb } from "../enums/verb.enum";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchUnsubscriberService } from "../../shared/services/search-unsubscriber/search-unsubscriber.service";
import { Configuration } from "../../app/configuration/configuration";
import { ActionLogModalComponent } from "./modals/action-log-modal.component";
import { FormsModule } from "@angular/forms";
import { NomenclatureSelectComponent } from "../../shared/components/nomenclature-select/nomenclature-select.component";
import { EnumSelectComponent } from "../../shared/components/enum-select/enum-select.component";
import { DatetimeComponent } from "../../shared/components/date-time/date-time.component";
import { SyncButtonComponent } from "../../shared/components/sync-button/sync-button.component";
import { SearchResultCountComponent } from "../../shared/components/search-result-count/search-result-count.component";
import { CommonModule } from "@angular/common";
import { LoadingSectionComponent } from "../../shared/components/loading-section/loading-section.component";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    standalone: true,
    selector: 'action-log-search',
    templateUrl: './action-log-search.component.html',
    providers: [
        LogsResource,
        SearchUnsubscriberService
    ],
    imports: [FormsModule, NomenclatureSelectComponent, EnumSelectComponent, DatetimeComponent, SyncButtonComponent, SearchResultCountComponent, CommonModule, LoadingSectionComponent, TranslateModule]
    
})
export class ActionLogSearchComponent extends BaseLogSearchComponent<ActionLogDto, ActionLogFilterDto> {

    verb = Verb;

    constructor(
        protected override resource: LogsResource<ActionLogDto, ActionLogFilterDto>,
        protected override searchUnsubscriberService: SearchUnsubscriberService,
        protected override modalService: NgbModal,
        public override configuration: Configuration
    ) {
        super(resource, ActionLogFilterDto, 'actions', searchUnsubscriberService, modalService, configuration);
    }

    openDetails(id: number) {
        const modal = this.modalService.open(ActionLogModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.logId = id;
    }
}