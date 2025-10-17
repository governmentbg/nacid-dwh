import { Component, HostListener, OnInit } from "@angular/core";
import { SearchUnsubscriberService } from "../../../shared/services/search-unsubscriber/search-unsubscriber.service";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { SearchResultDto } from "../../../shared/dtos/search-result.dto";
import { TemplateGroupFilterDto } from "../../filter-dtos/template-group-filter.dto";
import { TemplateGroupResource } from "../../resources/template-group.resource";
import { PermissionService } from "../../../auth/services/permission.service";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { EnumSelectComponent } from "../../../shared/components/enum-select/enum-select.component";
import { TemplateAccessLevel } from "../../enums/template-access-level.enum";
import { LoadingSectionComponent } from "../../../shared/components/loading-section/loading-section.component";
import { SearchResultComponent } from "../../../shared/components/search-result/search-result.component";
import { NgbModal, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { TemplateGroupSearchDto } from "../../dtos/search/template-group-search.dto";
import { templateCreatePermission } from "../../../auth/constants/permission.constants";
import { TemplateGroupAddModalComponent } from "../modals/template-group-add-modal.component";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { TemplateGroupSearchCardComponent } from "./template-group-search-card.component";

@Component({
    standalone: true,
    selector: 'template-group-search',
    templateUrl: './template-group-search.component.html',
    imports: [SyncButtonComponent, TranslateModule, FormsModule, EnumSelectComponent, LoadingSectionComponent, SearchResultComponent, NgbPagination, TemplateGroupSearchCardComponent],
    providers: [SearchUnsubscriberService]
})
export class TemplateGroupSearchComponent implements OnInit {

    hasTemplatesCreatePermission = this.permissionService.verifyPermission(templateCreatePermission);

    loadingData = false;
    getDataPending = false;
    clearDataPending = false;

    searchResult: SearchResultDto<TemplateGroupSearchDto> = new SearchResultDto<TemplateGroupSearchDto>();
    filter = new TemplateGroupFilterDto();

    templateAccessLevel = TemplateAccessLevel;

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler() {
        this.getData(true);
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.clear();
    }

    constructor(
        private resource: TemplateGroupResource,
        private searchUnsubscriberService: SearchUnsubscriberService,
        private modalService: NgbModal,
        public permissionService: PermissionService
    ) {
    }

    addTemplateGroup() {
        const modal = this.modalService.open(TemplateGroupAddModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });

        return modal.result.then((templateGroupDto: TemplateGroupDto) => {
            if (templateGroupDto) {

                if (this.searchResult.totalCount < 10) {
                    const newTemplateGroupSearchDto = new TemplateGroupSearchDto();
                    newTemplateGroupSearchDto.accessLevel = templateGroupDto.accessLevel;
                    newTemplateGroupSearchDto.description = templateGroupDto.description;
                    newTemplateGroupSearchDto.descriptionAlt = templateGroupDto.descriptionAlt;
                    newTemplateGroupSearchDto.id = templateGroupDto.id;
                    newTemplateGroupSearchDto.name = templateGroupDto.name;
                    newTemplateGroupSearchDto.nameAlt = templateGroupDto.nameAlt;
                    newTemplateGroupSearchDto.templateQueryCount = 0;
                    this.searchResult.result.push(newTemplateGroupSearchDto);
                }

                this.searchResult.totalCount++;
            }
        });
    }

    getData(getData: boolean) {
        this.unsubscribe(1);

        if (getData) {
            this.getDataPending = true;
        }

        this.filter.offset = (this.filter.currentPage - 1) * this.filter.limit;

        var subscriber = this.resource
            .getSearchResultDto(this.filter)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.loadingData = false;
                    this.clearDataPending = false;
                    this.getDataPending = false;
                    return throwError(() => err);
                })
            )
            .subscribe(e => {
                this.searchResult = e;
                this.loadingData = false;
                this.clearDataPending = false;
                this.getDataPending = false;
            });

        this.searchUnsubscriberService.addSubscription(1, subscriber);
        return subscriber;
    }

    clear() {
        this.filter = new TemplateGroupFilterDto();
        this.loadingData = false;
        this.getDataPending = false;
        this.clearDataPending = true;
        return this.getData(false);
    }

    private unsubscribe(searchType: number) {
        this.searchUnsubscriberService.unsubscribeByType(searchType);
    }

    ngOnInit() {
        this.loadingData = true;
        return this.getData(false);
    }
}
