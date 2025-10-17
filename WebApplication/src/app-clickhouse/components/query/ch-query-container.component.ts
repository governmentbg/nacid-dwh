import { Component, Input, ViewChild } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ChQueryDto } from "../../dtos/ch-query.dto";
import { NomenclatureSelectComponent } from "../../../shared/components/nomenclature-select/nomenclature-select.component";
import { FormsModule } from "@angular/forms";
import { ChOutputDto } from "../../dtos/output/ch-output.dto";
import { ChOutputComponent } from "./output/ch-output.component";
import { ChConditionComponent } from "./condition/ch-condition.component";
import { ChOrderByComponent } from "./order-by/ch-order-by.component";
import { ChGroupByComponent } from "./group-by/ch-group-by.component";
import { ChGroupByDto } from "../../dtos/group-by/ch-group-by.dto";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { NgbDropdownItem, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChQueryStringModal } from "./modals/ch-query-string.modal";
import { Clipboard } from "@angular/cdk/clipboard";
import { HttpParams } from "@angular/common/http";
import { AlertMessageService } from "../../../shared/components/alert-message/services/alert-message.service";
import { AlertMessageDto } from "../../../shared/components/alert-message/models/alert-message.dto";
import { DropdownButtonComponent } from "../../../shared/components/dropdown-button/dropdown-button.component";
import { TemplateQueryAddModalComponent } from "../../../app-templates/components/modals/template-query-add-modal.component";
import { TemplateQueryDto } from "../../../app-templates/dtos/template-query.dto";
import { PermissionService } from "../../../auth/services/permission.service";
import { templateCreatePermission, templateWritePermission } from "../../../auth/constants/permission.constants";
import { QueryType } from "../../enums/query-type.enum";
import { Configuration } from "../../../app/configuration/configuration";
import { ColumnVisualization } from "../../../shared/enums/column-visualization.enum";
import { TemplateQueryResource } from "../../../app-templates/resources/template-query.resource";
import { catchError, throwError } from "rxjs";
import { MessageModalComponent } from "../../../shared/components/message-modal/message-modal.component";

@Component({
    standalone: true,
    selector: 'ch-query-container',
    templateUrl: './ch-query-container.component.html',
    imports: [TranslateModule, NomenclatureSelectComponent, FormsModule, ChOutputComponent, ChConditionComponent, ChGroupByComponent, ChOrderByComponent, SyncButtonComponent, DropdownButtonComponent, NgbDropdownItem]
})
export class ChQueryContainerComponent {

    hasTemplatesCreatePermission = this.permissionService.verifyPermission(templateCreatePermission);
    hasTemplatesWritePermission = this.permissionService.verifyPermission(templateWritePermission);
    columnVisualizationText = this.configuration.columnVisualization === ColumnVisualization.full ? '{comment}, {name}' : '{comment}';

    queryType = QueryType;

    @Input() chQuery = new ChQueryDto();
    @Input() templateName: string;
    @Input() templateGroupName: string;
    @Input() templateQueryId: number;

    @ViewChild('chOutputComp') chOutputComponent: ChOutputComponent;
    @ViewChild('chConditionComp') chConditionComponent: ChConditionComponent;
    @ViewChild('chGroupByComp') chGroupByComponent: ChGroupByComponent;
    @ViewChild('chOrderByComp') chOrderByComponent: ChOrderByComponent;

    constructor(private modalService: NgbModal,
        private clipboard: Clipboard,
        private alertMessageService: AlertMessageService,
        public permissionService: PermissionService,
        private configuration: Configuration,
        private resource: TemplateQueryResource
    ) {
    }

    openQueryModal() {
        const modal = this.modalService.open(ChQueryStringModal, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.chQuery = this.chQuery;
    }

    copyAsUrl() {
        let queryParams = new HttpParams().set('chQuery', JSON.stringify(this.chQuery));
        
        if (this.templateGroupName != null) {
            queryParams = queryParams.set('templateGroupName', this.templateGroupName);
        }
        if (this.templateName != null) {
            queryParams = queryParams.set('templateName', this.templateName);
        }

        this.clipboard.copy(`${window.location.origin}/#/reports?${queryParams}`);
        const alertMessage = new AlertMessageDto('successTexts.copiedAsLink', 'fa-solid fa-check', null, 'bg-success text-light');
        this.alertMessageService.show(alertMessage);
    }

    openAddTemplateQuery() {
        const modal = this.modalService.open(TemplateQueryAddModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.chQuery = this.chQuery;

        return modal.result.then((templateQueryDto: TemplateQueryDto) => {
            if (templateQueryDto) {
                this.templateGroupName = templateQueryDto.templateGroup?.name || null;
                this.templateName = templateQueryDto.name || null;

                const alertMessage = new AlertMessageDto('successTexts.createdTemplate', 'fa-solid fa-check', null, 'bg-success text-light');
                this.alertMessageService.show(alertMessage);
            }
        });
    }

    editTemplateQuery() {
        const modal = this.modalService.open(MessageModalComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.text = 'templates.query.editConfirmation';
        modal.componentInstance.acceptButton = 'root.buttons.yesSure';
    
        modal.result.then((ok: boolean) => {
        if (ok) {
            this.resource
            .updateQuery(this.templateQueryId, this.chQuery)
            .pipe(
              catchError(err => {
                return throwError(() => err);
              })
            )
            .subscribe(() => {
                const alertMessage = new AlertMessageDto('successTexts.templateQueryEdit', 'fa-solid fa-check', null, 'bg-success text-light');
                this.alertMessageService.show(alertMessage);
            });
        }});
    }

    changeQueryType(queryType: QueryType) {
        this.chQuery.table = null;
        this.chQuery.subquery = null;
        this.chQuery.queryType = queryType;

        this.clearQuery();
    }

    clearQuery() {
        this.chQuery.output = [];
        this.chQuery.condition = [];
        this.chQuery.groupBy = [];
        this.chQuery.orderBy = [];

        if (this.chOutputComponent) {
            this.chOutputComponent.chOutputPreparation = new ChOutputDto();
        }

        if (this.chGroupByComponent) {
            this.chGroupByComponent.chGroupByPreparation = new ChGroupByDto();
        }
    }
}