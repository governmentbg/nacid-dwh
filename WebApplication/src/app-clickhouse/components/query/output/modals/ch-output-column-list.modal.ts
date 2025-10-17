import { Component, HostListener, Input, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../../shared/components/sync-button/sync-button.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ChSchemaResource } from "../../../../resources/ch-schema.resource";
import { ChColumnFilterDto } from "../../../../filter-dtos/ch-column-filter.dto";
import { catchError, filter, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { SearchResultDto } from "../../../../../shared/dtos/search-result.dto";
import { ChColumnDto } from "../../../../dtos/output/ch-column.dto";
import { LoadingSectionComponent } from "../../../../../shared/components/loading-section/loading-section.component";
import { SlicePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'ch-output-column-list-modal',
    templateUrl: './ch-output-column-list.modal.html',
    imports: [FormsModule, TranslateModule, SyncButtonComponent, LoadingSectionComponent, SlicePipe]
})
export class ChOutputColumnListModalComponent implements OnInit {

    loadingData = false;
    endIndex = 10;
    chColumnDtos: ChColumnDto[] = [];
    originalChColumnDtos: ChColumnDto[] = [];
    filterDto = new ChColumnFilterDto();
    textFilter: string = null;

    @Input() table: string;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.loadingData) {
            this.decline();
        }
    }

    constructor(
        private resource: ChSchemaResource,
        private activeModal: NgbActiveModal) {
    }

    selectChColumn(item: ChColumnDto) {
        this.activeModal.close(item);
    }

    decline() {
        this.activeModal.close(false);
    }

    columnFilterChanged(textFilter: string) {
        if (textFilter) {
            textFilter = textFilter.toLowerCase();
            this.chColumnDtos = this.originalChColumnDtos.filter(e => e.name.toLowerCase().includes(textFilter) || e.comment.toLowerCase().includes(textFilter));
        } else {
            this.chColumnDtos = JSON.parse(JSON.stringify(this.originalChColumnDtos)) as ChColumnDto[];
        }
    }

    private setFilter() {
        this.filterDto.getAllData = true;
    }

    ngOnInit() {
        this.loadingData = true;
        this.setFilter();
        this.resource.getTableColumns(this.table, this.filterDto)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: SearchResultDto<ChColumnDto>) => {
                this.loadingData = false;
                this.chColumnDtos = result?.result;
                this.originalChColumnDtos = result?.result;
            });
    }
}