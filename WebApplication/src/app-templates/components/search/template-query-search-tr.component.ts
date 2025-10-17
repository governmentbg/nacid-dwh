import { HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TemplateQueryDto } from "../../dtos/template-query.dto";
import { TranslateFieldComponent } from "../../../shared/components/translate-field/translate-field.component";
import { TemplateAccessLevel } from "../../enums/template-access-level.enum";
import { TranslateModule } from "@ngx-translate/core";
import { saveAs } from "file-saver-es";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TemplateQueryEditModalComponent } from "../modals/template-query-edit-modal.component";
import { MessageModalComponent } from "../../../shared/components/message-modal/message-modal.component";
import { TemplateQueryResource } from "../../resources/template-query.resource";
import { catchError, throwError } from "rxjs";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { TemplateQueryMoveGroupModalComponent } from "../modals/template-query-move-group-modal.component";
import { TemplateQueryCopyGroupModalComponent } from "../modals/template-query-copy-to-group-modal.component";
import { AlertMessageDto } from "../../../shared/components/alert-message/models/alert-message.dto";
import { AlertMessageService } from "../../../shared/components/alert-message/services/alert-message.service";
import { PageHandlingService } from "../../../shared/services/page-handling/page-handling.service";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    selector: 'tr[template-query-search-tr]',
    templateUrl: './template-query-search-tr.component.html',
    imports: [TranslateFieldComponent, TranslateModule]
})
export class TemplateQuerySearchTrComponent {

    templateAccessLevel = TemplateAccessLevel;
    buttonsActionSubmiting = false;

    @Input() templateQuery = new TemplateQueryDto();
    @Input() templateGroup: TemplateGroupDto;
    @Output() triggerRemove: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private resource: TemplateQueryResource,
        private modalService: NgbModal,
        private alertMessageService: AlertMessageService,
        private pageHandlingService: PageHandlingService,
        private router: Router) {
    }

    saveAsShortcut() {
        const queryParams = new HttpParams()
            .set('chQuery', this.templateQuery.jsonQuery)
            .set('templateQueryId', this.templateQuery.id)
            .set('templateGroupName', this.templateGroup.name)
            .set('templateName', this.templateQuery.name);

        const content = `${window.location.origin}/#/reports?${queryParams}`;
        saveAs(new Blob([content], { type: 'text/plain;charset=utf-8' }), `${this.templateQuery.name}.txt`)
    }

    openQuery() {
        const queryParams = new HttpParams()
            .set('chQuery', this.templateQuery.jsonQuery)
            .set('templateQueryId', this.templateQuery.id)
            .set('templateGroupName', this.templateGroup.name)
            .set('templateName', this.templateQuery.name);

        window.open(`${window.location.origin}/#/reports?${queryParams}`, "_blank");
    }

    editTemplateQuery() {
        const modal = this.modalService.open(TemplateQueryEditModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.templateQueryId = this.templateQuery.id;

        return modal.result.then((updatedTemplateQueryDto: TemplateQueryDto) => {
            if (updatedTemplateQueryDto) {
                this.templateQuery = updatedTemplateQueryDto;
            }
        });
    }

    downloadSql() {
        this.buttonsActionSubmiting = true;
        const sqlBlob = new Blob([this.templateQuery.rawQuery], { type: 'application/sql;charset=utf-8' });
        saveAs(sqlBlob, `${this.templateQuery.name}.sql`);
        this.buttonsActionSubmiting = false;
    }

    deleteTemplateQuery() {
        const modal = this.modalService.open(MessageModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.text = 'templates.query.deleteTitle';
        modal.componentInstance.text2 = 'root.modals.confirmDelete';
        modal.componentInstance.acceptButton = 'root.buttons.yesSure';

        return modal.result.then((ok: boolean) => {
            if (ok) {
                this.buttonsActionSubmiting = true;
                this.resource.delete(this.templateQuery.id)
                    .pipe(
                        catchError((err: HttpErrorResponse) => {
                            this.buttonsActionSubmiting = false;
                            return throwError(() => err);
                        })
                    )
                    .subscribe(() => {
                        this.triggerRemove.emit();
                        this.buttonsActionSubmiting = false;
                    });
            }
        });
    }

    moveTemplateGroup() {
        const modal = this.modalService.open(TemplateQueryMoveGroupModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.templateQuery = this.templateQuery;

        return modal.result.then((newGroup: TemplateGroupDto) => {
            if (newGroup) {
                const alertMessage = new AlertMessageDto('successTexts.movedToTemplateGroup', 'fa-solid fa-check', null, 'bg-success text-light');
                this.alertMessageService.show(alertMessage);
                this.changeTemplateGroup(newGroup.id);
            }
        });
    }

    copyToTemplateGroup() {
        const modal = this.modalService.open(TemplateQueryCopyGroupModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.templateQuery = this.templateQuery;

        return modal.result.then((copied: TemplateQueryDto) => {
            if (copied) {
                const alertMessage = new AlertMessageDto('successTexts.copiedToTemplateGroup', 'fa-solid fa-check', null, 'bg-success text-light');
                this.alertMessageService.show(alertMessage);
                this.changeTemplateGroup(copied.templateGroupId);
            }
        });
    }

    private changeTemplateGroup(templateGroupId: number) {
        this.pageHandlingService.scrollToTop();
        this.router.navigate([`/templateQueries/${templateGroupId}`]);
    }
}