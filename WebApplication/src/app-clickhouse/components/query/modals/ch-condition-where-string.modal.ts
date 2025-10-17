import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { Component, HostListener, Input, OnInit } from "@angular/core";
import { ChQueryResource } from "../../../resources/ch-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { LoadingSectionComponent } from "../../../../shared/components/loading-section/loading-section.component";
import { ChConditionDto } from "../../../dtos/condition/ch-condition.dto";
import { QueryType } from "../../../enums/query-type.enum";

@Component({
    standalone: true,
    selector: 'ch-condition-where-string-modal',
    templateUrl: './ch-condition-where-string.modal.html',
    imports: [SyncButtonComponent, TranslateModule, LoadingSectionComponent]
})
export class ChConditionWhereStringModal implements OnInit {

    loadingData = false;
    whereString: string;

    @Input() chQueryType: QueryType;
    @Input() chCondition: ChConditionDto[] = [];

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
        this.resource.getWhere(this.chQueryType, this.chCondition)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: string) => {
                this.loadingData = false;
                this.whereString = result;
            });
    }
}