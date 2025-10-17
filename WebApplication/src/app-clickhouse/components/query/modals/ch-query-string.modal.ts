import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { Component, HostListener, Input, OnInit } from "@angular/core";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadingSectionComponent } from "../../../../shared/components/loading-section/loading-section.component";
import { ChQueryDto } from "../../../dtos/ch-query.dto";

@Component({
    standalone: true,
    selector: 'ch-query-string-modal',
    templateUrl: './ch-query-string.modal.html',
    imports: [SyncButtonComponent, TranslateModule, LoadingSectionComponent]
})
export class ChQueryStringModal implements OnInit {

    loadingData = false;
    queryString: string;

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
        this.resource.getQueryString(this.chQuery)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: string) => {
                this.loadingData = false;
                this.queryString = result;
            });
    }
}