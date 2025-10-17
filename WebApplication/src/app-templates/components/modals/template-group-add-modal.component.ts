import { Component, HostListener, ViewChild } from "@angular/core";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { FormsModule, NgForm } from "@angular/forms";
import { TemplateGroupResource } from "../../resources/template-group.resource";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { TemplateGroupBasicComponent } from "./basic/template-group-basic.component";

@Component({
    standalone: true,
    selector: 'template-group-add-modal',
    templateUrl: './template-group-add-modal.component.html',
    imports: [TranslateModule, SyncButtonComponent, FormsModule, TemplateGroupBasicComponent]
})
export class TemplateGroupAddModalComponent {

    addTemplateGroupPending = false;
    templateGroupDto: TemplateGroupDto = new TemplateGroupDto();

    @ViewChild(NgForm) form: NgForm;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        if (!this.addTemplateGroupPending) {
            this.decline();
        }
    }

    @HostListener('document:keydown.enter', ['$event']) onKeydownEnterHandler() {
        this.add();
    }

    constructor(
        private resource: TemplateGroupResource,
        private activeModal: NgbActiveModal) {
    }

    add() {
        if (this.form.valid) {
            this.addTemplateGroupPending = true;
            this.resource
                .create(this.templateGroupDto)
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.addTemplateGroupPending = false;
                        this.decline();
                        return throwError(() => err);
                    })
                )
                .subscribe(e => {
                    this.addTemplateGroupPending = false;
                    this.activeModal.close(e);
                });
        }
    }

    decline() {
        this.activeModal.close(false);
    }
}