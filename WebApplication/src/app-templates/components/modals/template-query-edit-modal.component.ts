import { Component, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { FormsModule, NgForm } from "@angular/forms";
import { TemplateQueryBasicComponent } from "./basic/template-query-basic.component";
import { LoadingSectionComponent } from "../../../shared/components/loading-section/loading-section.component";
import { TemplateQueryDto } from "../../dtos/template-query.dto";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    standalone: true,
    selector: 'template-query-edit-modal',
    templateUrl: './template-query-edit-modal.component.html',
    imports: [TranslateModule, SyncButtonComponent, FormsModule, TemplateQueryBasicComponent, LoadingSectionComponent]
})
export class TemplateQueryEditModalComponent implements OnInit {

    @Input() templateQueryId: number;

    editTemplateQueryPending = false;
    templateQueryDto: TemplateQueryDto = new TemplateQueryDto();
    originalModel = new TemplateQueryDto();
    isEditMode = false;
    loadingData = false;

    @ViewChild(NgForm) form: NgForm;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.editTemplateQueryPending) {
            this.decline();
        }
    }

    constructor(
        private resource: TemplateQueryResource,
        private activeModal: NgbActiveModal) {
    }

    edit() {
        this.originalModel = JSON.parse(JSON.stringify(this.templateQueryDto)) as TemplateQueryDto;
        this.isEditMode = true;
    }

    cancel() {
        this.templateQueryDto = JSON.parse(JSON.stringify(this.originalModel)) as TemplateQueryDto;
        this.isEditMode = false;
        this.originalModel = null;
    }

    save() {
        if (this.form.valid) {
            this.editTemplateQueryPending = true;
            this.resource
                .update(this.templateQueryDto)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.editTemplateQueryPending = false;
                        this.decline();
                        return throwError(() => err);
                    })
                )
                .subscribe(e => {
                    this.editTemplateQueryPending = false;
                    this.activeModal.close(e);
                });
        }
    }

    decline() {
        this.activeModal.close(false);
    }

    ngOnInit() {
        this.loadingData = true;
        this.resource.getById(this.templateQueryId)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: TemplateQueryDto) => {
                this.loadingData = false;
                this.templateQueryDto = result;
            });
    }
}