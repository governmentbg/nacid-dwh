import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ChQueryDto } from "../dtos/ch-query.dto";
import { ChQueryContainerComponent } from "./query/ch-query-container.component";
import { SyncButtonComponent } from "../../shared/components/sync-button/sync-button.component";
import { ChQueryResource } from "../resources/ch-query.resource";
import { SearchUnsubscriberService } from "../../shared/services/search-unsubscriber/search-unsubscriber.service";
import { TitledSearchResult } from "../../shared/dtos/titled-search-result.dto";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ChResultComponent } from "./result/ch-result.component";
import { OutputChangeService } from "../services/output-change.service";
import { ChOutputDto } from "../dtos/output/ch-output.dto";
import { ChPaginationDto } from "../dtos/ch-pagination.dto";
import { ActivatedRoute } from "@angular/router";

@Component({
    standalone: true,
    selector: 'ch-report',
    templateUrl: './ch-report.component.html',
    imports: [ChQueryContainerComponent, SyncButtonComponent, ChResultComponent],
    providers: [SearchUnsubscriberService, OutputChangeService]
})
export class ChReportComponent implements OnInit, AfterContentInit {

    getQueryPending = false;
    getChunkPending = false;

    chQuery = new ChQueryDto();
    titledSearchResult: TitledSearchResult<any> = new TitledSearchResult<any>();
    templateName: string;
    templateGroupName: string;
    templateQueryId: number;

    constructor(
        private chQueryResource: ChQueryResource,
        private searchUnsubscriberService: SearchUnsubscriberService,
        private outputChangeService: OutputChangeService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef) {
    }

    getQuery(clearPagination: boolean) {
        this.unsubscribe(1);

        this.getQueryPending = clearPagination;
        this.getChunkPending = !clearPagination;

        if (clearPagination) {
            this.chQuery.pagination = new ChPaginationDto();
        } else {
            this.chQuery.pagination.offset = (this.chQuery.pagination.currentPage - 1) * this.chQuery.pagination.limit;
        }

        var subscriber = this.chQueryResource
            .getQuery(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.getQueryPending = false;
                    this.getChunkPending = false;
                    return throwError(() => err);
                })
            )
            .subscribe(e => {
                this.titledSearchResult = e;
                this.getQueryPending = false;
                this.getChunkPending = false;
            });

        this.searchUnsubscriberService.addSubscription(1, subscriber);
        return subscriber;
    }

    clearAll() {
        this.chQuery = new ChQueryDto();
        this.templateName = null;
        this.templateGroupName = null;
        this.titledSearchResult = new TitledSearchResult<any>();
    }

    private unsubscribe(searchType: number) {
        this.getQueryPending = false;
        this.getChunkPending = false;
        this.searchUnsubscriberService.unsubscribeByType(searchType);
    }

    ngOnInit() {
        this.outputChangeService
            .subscribe((value: ChOutputDto[]) => {
                this.chQuery.output = value;
            });
    }

    ngAfterContentInit() {
        this.route.queryParams.subscribe(params => {
            if (params['chQuery']) {
                this.chQuery = JSON.parse(params['chQuery']);
                this.templateGroupName = params['templateGroupName'];
                this.templateName = params['templateName'];
                this.templateQueryId = params['templateQueryId'];
    
                this.outputChangeService.next(this.chQuery.output);
            } 
        });

        this.cdr.detectChanges();
    }
}