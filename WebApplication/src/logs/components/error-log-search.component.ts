import { Component } from "@angular/core";
import { BaseLogSearchComponent } from "./base/base-log-search.component";
import { LogsResource } from "../log.resource";
import { ErrorLogDto } from "../dtos/error-log.dto";
import { ErrorLogFilterDto } from "../dtos/filters/error-log-filter.dto";
import { ErrorLogType } from "../enums/error-log-type.enum";
import { Verb } from "../enums/verb.enum";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchUnsubscriberService } from "../../shared/services/search-unsubscriber/search-unsubscriber.service";
import { Configuration } from "../../app/configuration/configuration";
import { ErrorLogModalComponent } from "./modals/error-log-modal.component";
import { FormsModule } from "@angular/forms";
import { NomenclatureSelectComponent } from "../../shared/components/nomenclature-select/nomenclature-select.component";
import { EnumSelectComponent } from "../../shared/components/enum-select/enum-select.component";
import { DatetimeComponent } from "../../shared/components/date-time/date-time.component";
import { SyncButtonComponent } from "../../shared/components/sync-button/sync-button.component";
import { SearchResultCountComponent } from "../../shared/components/search-result-count/search-result-count.component";
import { CommonModule } from "@angular/common";
import { LoadingSectionComponent } from "../../shared/components/loading-section/loading-section.component";
import { TranslateModule } from "@ngx-translate/core";
import { EnumSelect } from "../../shared/components/enum-select/enum-select.model";
import { TranslateEnumComponent } from "../../shared/components/translate-enum/translate-enum.component";

@Component({
    standalone: true,
    selector: 'error-log-search',
    templateUrl: './error-log-search.component.html',
    providers: [
        LogsResource,
        SearchUnsubscriberService,
        
    ],
    imports: [FormsModule, NomenclatureSelectComponent, EnumSelectComponent, DatetimeComponent, SyncButtonComponent, SearchResultCountComponent, CommonModule, LoadingSectionComponent, TranslateModule, TranslateEnumComponent ]
})
export class ErrorLogSearchComponent extends BaseLogSearchComponent<ErrorLogDto, ErrorLogFilterDto> {

    errorLogType = ErrorLogType;
    verb = Verb;

    constructor(
        protected override resource: LogsResource<ErrorLogDto, ErrorLogFilterDto>,
        protected override searchUnsubscriberService: SearchUnsubscriberService,
        protected override modalService: NgbModal,
        public override configuration: Configuration
    ) {
        super(resource, ErrorLogFilterDto, 'errors', searchUnsubscriberService, modalService, configuration);
    }

    openDetails(id: number) {
        const modal = this.modalService.open(ErrorLogModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.logId = id;
    }
}