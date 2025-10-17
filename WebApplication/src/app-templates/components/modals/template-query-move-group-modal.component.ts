import { Component, Input, ViewChild } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TemplateQueryDto } from "../../dtos/template-query.dto";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { FormsModule, NgForm } from "@angular/forms";
import { NomenclatureSelectComponent } from "../../../shared/components/nomenclature-select/nomenclature-select.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageModalComponent } from "../../../shared/components/message-modal/message-modal.component";

@Component({
    standalone: true,
    selector: 'template-query-move-group-modal',
    templateUrl: './template-query-move-group-modal.component.html',
    imports: [FormsModule, NomenclatureSelectComponent, TranslateModule, SyncButtonComponent],
})
export class TemplateQueryMoveGroupModalComponent {
    @Input() templateQuery: TemplateQueryDto;
    selectedGroup: TemplateGroupDto;
    
    moveTemplateGroupPending = false;

    @ViewChild(NgForm) form: NgForm;
    
    constructor(
        private resource: TemplateQueryResource,
        public activeModal: NgbActiveModal, 
        public translateService: TranslateService,
        public modalService: NgbModal
    ) {}

    move() {
        if (this.form.valid) {
            const modal = this.modalService.open(MessageModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
            modal.componentInstance.text = 'templates.query.moveConfirmation';
            modal.componentInstance.acceptButton = 'root.buttons.yesSure';

            modal.result.then((ok: boolean) => {
                if (ok) {
                    this.moveTemplateGroupPending = true;
                    this.resource.moveToGroup(this.templateQuery.id, this.selectedGroup.id)
                    .pipe(
                        catchError((err: HttpErrorResponse) => {
                            this.moveTemplateGroupPending = false;
                            this.decline();
                            return throwError(() => err);
                        }))
                    .subscribe(() => {
                        this.moveTemplateGroupPending = false;
                        this.activeModal.close(this.selectedGroup);
                    });
                }
            })
        }
    }
    
    decline() {
        this.activeModal.close(false);
    }
}