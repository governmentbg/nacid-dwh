import { Component, HostListener, Input, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { FormsModule, NgForm } from "@angular/forms";
import { TemplateQueryBasicComponent } from "./basic/template-query-basic.component";
import { TemplateQueryCreateDto } from "../../dtos/template-query-create.dto";
import { ChQueryDto } from "../../../app-clickhouse/dtos/ch-query.dto";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    standalone: true,
    selector: 'template-query-add-modal',
    templateUrl: './template-query-add-modal.component.html',
    imports: [TranslateModule, SyncButtonComponent, FormsModule, TemplateQueryBasicComponent]
})
export class TemplateQueryAddModalComponent {

    addTemplateQueryPending = false;
    templateQueryCreateDto: TemplateQueryCreateDto = new TemplateQueryCreateDto();

    @Input() chQuery = new ChQueryDto();

    @ViewChild(NgForm) form: NgForm;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.addTemplateQueryPending) {
            this.decline();
        }
    }

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler() {
        this.add();
    }

    constructor(
        private resource: TemplateQueryResource,
        private activeModal: NgbActiveModal) {
    }

    add() {
        if (this.form.valid) {
            this.addTemplateQueryPending = true;
            this.templateQueryCreateDto.chQuery = this.chQuery;
            this.resource
                .create(this.templateQueryCreateDto)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.addTemplateQueryPending = false;
                        this.decline();
                        return throwError(() => err);
                    })
                )
                .subscribe(e => {
                    this.addTemplateQueryPending = false;
                    this.activeModal.close(this.templateQueryCreateDto.templateQuery);
                });
        }
    }

    decline() {
        this.activeModal.close(false);
    }
}