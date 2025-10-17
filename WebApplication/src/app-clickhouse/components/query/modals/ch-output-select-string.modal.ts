import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { Component, HostListener, Input, OnInit } from "@angular/core";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadingSectionComponent } from "../../../../shared/components/loading-section/loading-section.component";
import { QueryType } from "../../../enums/query-type.enum";

@Component({
    standalone: true,
    selector: 'ch-output-select-string-modal',
    templateUrl: './ch-output-select-string.modal.html',
    imports: [SyncButtonComponent, TranslateModule, LoadingSectionComponent]
})
export class ChOutputSelectStringModal implements OnInit {

    loadingData = false;
    selectString: string;

    @Input() chQueryType: QueryType;
    @Input() chOutput: ChOutputDto[] = [];

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
        this.resource.getSelect(this.chQueryType, this.chOutput)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: string) => {
                this.loadingData = false;
                this.selectString = result;
            });
    }
}