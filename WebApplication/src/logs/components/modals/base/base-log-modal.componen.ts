import { HttpErrorResponse } from "@angular/common/http";
import { Directive, HostListener, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { LogsResource } from "../../../log.resource";
import { Verb } from "../../../enums/verb.enum";
import { BaseLogDto } from "../../../dtos/base/base-log.dto";
import { FilterPropDto } from "../../../../shared/filter-dtos/filter-prop.dto";

@Directive()
export abstract class BaseLogModalComponent<TLog extends BaseLogDto, TFilter extends FilterPropDto> implements OnInit {

    @Input() logId: number;

    log: TLog = null;
    loadingData = false;

    verb = Verb;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.decline();
    }

    constructor(
        protected resource: LogsResource<TLog, TFilter>,
        protected activeModal: NgbActiveModal,
        protected logUrl: string
    ) {
        this.resource.init(logUrl);
    }

    decline() {
        this.activeModal.close(false);
    }

    ngOnInit() {
        this.loadingData = true;
        this.resource.getById(this.logId)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: TLog) => {
                this.loadingData = false;
                result.bodyObj = JSON.parse(result.body);
                this.log = result;
            })
    }
}