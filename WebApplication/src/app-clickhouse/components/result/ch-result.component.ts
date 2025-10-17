import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TitledSearchResult } from "../../../shared/dtos/titled-search-result.dto";
import { TranslateModule } from "@ngx-translate/core";
import { SearchResultComponent } from "../../../shared/components/search-result/search-result.component";
import { SlicePipe } from "@angular/common";
import { NgbDropdownItem, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { DropdownButtonComponent } from "../../../shared/components/dropdown-button/dropdown-button.component";
import { ChExportResource } from "../../resources/ch-export.resource";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ChQueryDto } from "../../dtos/ch-query.dto";
import { saveAs } from "file-saver-es";
import { AutoDetectTypePipe } from "../../../shared/pipes/auto-detect-type.pipe";
import { ChOutputDto } from "../../dtos/output/ch-output.dto";

@Component({
    standalone: true,
    selector: 'ch-result',
    templateUrl: './ch-result.component.html',
    imports: [TranslateModule, SearchResultComponent, SlicePipe, NgbPagination, DropdownButtonComponent, NgbDropdownItem, AutoDetectTypePipe]
})
export class ChResultComponent {

    loadingExport = false;

    @Output() triggerGetQuery: EventEmitter<void> = new EventEmitter<void>();
    @Input() chQuery = new ChQueryDto();
    @Input() chOutput: ChOutputDto[] = [];
    @Input() getChunkPending = false;
    @Input() currentPage: number = 1;

    titledSearchResult: TitledSearchResult<any> = new TitledSearchResult<any>();
    @Input('titledSearchResult')
    set titledSearchResultSetter(titledSearchResult: TitledSearchResult<any>) {
        this.titledSearchResult = titledSearchResult;
        this.currentPage = 1;
    }

    constructor(private chExportResource: ChExportResource) {

    }

    getChunk() {
        this.triggerGetQuery.emit();
    }

    exportExcel() {
        this.loadingExport = true;
        return this.chExportResource.exportExcel(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.loadingExport = false;
                    return throwError(() => err);
                })
            )
            .subscribe((blob: Blob) => {
                saveAs(blob, 'Report.xlsx');
                this.loadingExport = false;
            });
    }

    exportCsv() {
        this.loadingExport = true;
        return this.chExportResource.exportCsv(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.loadingExport = false;
                    return throwError(() => err);
                })
            )
            .subscribe((blob: Blob) => {
                saveAs(blob, 'Report.csv');
                this.loadingExport = false;
            });
    }

    exportJson() {
        this.loadingExport = true;
        return this.chExportResource.exportJson(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.loadingExport = false;
                    return throwError(() => err);
                })
            )
            .subscribe((blob: Blob) => {
                saveAs(blob, 'Report.json');
                this.loadingExport = false;
            });
    }

    exportXml() {
        this.loadingExport = true;
        return this.chExportResource.exportXml(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.loadingExport = false;
                    return throwError(() => err);
                })
            )
            .subscribe((blob: Blob) => {
                saveAs(blob, 'Report.xml');
                this.loadingExport = false;
            });
    }
}