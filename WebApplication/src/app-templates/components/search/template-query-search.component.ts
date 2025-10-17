import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { EnumSelectComponent } from "../../../shared/components/enum-select/enum-select.component";
import { LoadingSectionComponent } from "../../../shared/components/loading-section/loading-section.component";
import { SearchResultComponent } from "../../../shared/components/search-result/search-result.component";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { SearchUnsubscriberService } from "../../../shared/services/search-unsubscriber/search-unsubscriber.service";
import { Component, HostListener } from "@angular/core";
import { TemplateQueryFilterDto } from "../../filter-dtos/template-query-filter.dto";
import { TemplateQueryDto } from "../../dtos/template-query.dto";
import { SearchResultDto } from "../../../shared/dtos/search-result.dto";
import { TemplateAccessLevel } from "../../enums/template-access-level.enum";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { ActivatedRoute } from "@angular/router";
import { Observable, Observer, catchError, forkJoin, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { TemplateGroupResource } from "../../resources/template-group.resource";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { FormsModule } from "@angular/forms";
import { TranslateFieldComponent } from "../../../shared/components/translate-field/translate-field.component";
import { BoolSelectComponent } from "../../../shared/components/bool-select/bool-select.component";
import { ClickStopPropagation } from "../../../shared/directives/click-stop-propagation.directive";
import { TemplateQuerySearchTrComponent } from "./template-query-search-tr.component";

@Component({
    standalone: true,
    selector: 'template-query-search',
    templateUrl: './template-query-search.component.html',
    imports: [SyncButtonComponent, TranslateModule, EnumSelectComponent, LoadingSectionComponent, SearchResultComponent, NgbPagination, FormsModule, TranslateFieldComponent, BoolSelectComponent, ClickStopPropagation, TemplateQuerySearchTrComponent],
    providers: [SearchUnsubscriberService]
})
export class TemplateQuerySearchComponent {

    templateGroupId = 0;
    loadingData = false;
    getDataPending = false;
    clearDataPending = false;
    templateAccessLevel = TemplateAccessLevel;

    searchResult: SearchResultDto<TemplateQueryDto> = new SearchResultDto<TemplateQueryDto>();
    filter = new TemplateQueryFilterDto();
    templateGroup = new TemplateGroupDto();

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler() {
        this.getData(true);
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.clear();
    }

    constructor(
        private route: ActivatedRoute,
        private resource: TemplateQueryResource,
        private templateGroupResource: TemplateGroupResource,
        private searchUnsubscriberService: SearchUnsubscriberService
    ) {
    }

    clear() {
        this.filter = new TemplateQueryFilterDto();
        this.getDataPending = false;
        this.clearDataPending = true;
        this.filter.templateGroupId = this.templateGroupId;
        return this.getData(false);
    }

    getData(getData: boolean) {
        return this.getDataObservable(getData)
            .subscribe(e => {
                this.searchResult = e;
                this.clearDataPending = false;
                this.getDataPending = false;
            });
    }

    removeTemplateQuery(index: number) {
        this.searchResult.result.splice(index, 1);
        this.searchResult.totalCount--;
    }

    private getDataObservable(getData: boolean) {
        return new Observable((observer: Observer<SearchResultDto<TemplateQueryDto>>) => {
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
                        observer.complete();
                        return throwError(() => err);
                    })
                )
                .subscribe(searchResult => {
                    observer.next(searchResult);
                    observer.complete();
                });

            this.searchUnsubscriberService.addSubscription(1, subscriber);
            return subscriber;
        });
    }

    private getTemplateGroup() {
        return new Observable((observer: Observer<TemplateGroupDto>) => {
            return this.templateGroupResource.getById(this.templateGroupId)
                .pipe(
                    catchError((err) => {
                        this.loadingData = false;
                        observer.complete();
                        return throwError(() => err);
                    })
                )
                .subscribe(templateGroup => {
                    observer.next(templateGroup);
                    observer.complete();
                });
        });
    }

    private unsubscribe(searchType: number) {
        this.searchUnsubscriberService.unsubscribeByType(searchType);
    }

    ngOnInit() {
        this.loadingData = true;
        this.route.params.subscribe(p => {
            this.templateGroupId = p['templateGroupId'];
            this.filter.templateGroupId = this.templateGroupId;
            return forkJoin([
                this.getDataObservable(false),
                this.getTemplateGroup()])
                .subscribe(([searchResult, templateGroup]) => {
                    this.searchResult = searchResult;
                    this.templateGroup = templateGroup;
                    this.loadingData = false;
                });
        });
    }
}