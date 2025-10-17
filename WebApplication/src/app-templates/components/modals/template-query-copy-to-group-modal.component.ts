import { Component, Input, ViewChild } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { NomenclatureSelectComponent } from "../../../shared/components/nomenclature-select/nomenclature-select.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { TemplateQueryDto } from "../../dtos/template-query.dto";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageModalComponent } from "../../../shared/components/message-modal/message-modal.component";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    standalone: true,
    selector: 'template-query-copy-to-group-modal',
    templateUrl: './template-query-copy-to-group-modal.component.html',
    imports: [FormsModule, NomenclatureSelectComponent, TranslateModule, SyncButtonComponent],
})
export class TemplateQueryCopyGroupModalComponent {
    @Input() templateQuery: TemplateQueryDto;
    selectedGroup: TemplateGroupDto;

    copyTemplateGroupPending = false;
    @ViewChild(NgForm) form: NgForm;

    constructor(
        private resource: TemplateQueryResource,
        public activeModal: NgbActiveModal, 
        public translateService: TranslateService,
        public modalService: NgbModal
    ) {}

    copy() {
        if (this.form.valid) {
            const modal = this.modalService.open(MessageModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
            modal.componentInstance.text = 'templates.query.copyConfirmation';
            modal.componentInstance.acceptButton = 'root.buttons.yesSure';

            modal.result.then((ok: boolean) => {
                if (ok) {
                    this.copyTemplateGroupPending = true;
                    this.resource.copyToGroup(this.templateQuery.id, this.selectedGroup.id)
                        .pipe(
                            catchError((err: HttpErrorResponse) => {
                                this.copyTemplateGroupPending = false;
                                this.decline();
                                return throwError(() => err);
                            }))
                        .subscribe((copied: TemplateQueryDto) => {
                            this.copyTemplateGroupPending = false;
                            this.activeModal.close(copied);
                        });
                }
            })
        }
    }

    decline() {
        this.activeModal.close(false);
    }
}
