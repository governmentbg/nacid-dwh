import { Component, HostListener, Input, OnInit } from "@angular/core";
import { LoadingSectionComponent } from "../../../../shared/components/loading-section/loading-section.component";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ChQueryDto } from "../../../dtos/ch-query.dto";

@Component({
    standalone: true,
    selector: 'ch-group-by-string-modal',
    templateUrl: './ch-group-by-string.modal.html',
    imports: [SyncButtonComponent, TranslateModule, LoadingSectionComponent]
})
export class ChGroupByStringModal implements OnInit {

    loadingData = false;
    groupByString: string;

    @Input() chQuery: ChQueryDto;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.loadingData) {
            this.decline();
        }
    }

    constructor(
        private resource: ChQueryResource,
        private activeModal: NgbActiveModal) {
    }

    decline() {
        this.activeModal.close(false);
    }

    ngOnInit() {
        this.loadingData = true;
        this.resource.getGroupBy(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: string) => {
                this.loadingData = false;
                this.groupByString = result;
            });
    }
}