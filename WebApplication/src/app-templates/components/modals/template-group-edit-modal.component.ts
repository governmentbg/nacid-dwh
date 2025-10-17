import { Component, HostListener, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TemplateGroupResource } from "../../resources/template-group.resource";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { FormsModule, NgForm } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { TemplateGroupBasicComponent } from "./basic/template-group-basic.component";
import { LoadingSectionComponent } from "../../../shared/components/loading-section/loading-section.component";

@Component({
    standalone: true,
    selector: 'template-group-edit-modal',
    templateUrl: './template-group-edit-modal.component.html',
    imports: [TranslateModule, SyncButtonComponent, FormsModule, TemplateGroupBasicComponent, LoadingSectionComponent]
})
export class TemplateGroupEditModalComponent implements OnInit {

    @Input() templateGroupId: number;

    editTemplateGroupPending = false;
    templateGroupDto: TemplateGroupDto = new TemplateGroupDto();
    originalModel = new TemplateGroupDto();
    isEditMode = false;
    loadingData = false;

    @ViewChild(NgForm) form: NgForm;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.editTemplateGroupPending) {
            this.decline();
        }
    }

    constructor(
        private resource: TemplateGroupResource,
        private activeModal: NgbActiveModal) {
    }

    edit() {
        this.originalModel = JSON.parse(JSON.stringify(this.templateGroupDto)) as TemplateGroupDto;
        this.isEditMode = true;
    }

    cancel() {
        this.templateGroupDto = JSON.parse(JSON.stringify(this.originalModel)) as TemplateGroupDto;
        this.isEditMode = false;
        this.originalModel = null;
    }

    save() {
        if (this.form.valid) {
            this.editTemplateGroupPending = true;
            this.resource
                .update(this.templateGroupDto)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.editTemplateGroupPending = false;
                        this.decline();
                        return throwError(() => err);
                    })
                )
                .subscribe(e => {
                    this.editTemplateGroupPending = false;
                    this.activeModal.close(e);
                });
        }
    }

    decline() {
        this.activeModal.close(false);
    }

    ngOnInit() {
        this.loadingData = true;
        this.resource.getById(this.templateGroupId)
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.decline();
                    return throwError(() => err);
                })
            )
            .subscribe((result: TemplateGroupDto) => {
                this.loadingData = false;
                this.templateGroupDto = result;
            });
    }
}