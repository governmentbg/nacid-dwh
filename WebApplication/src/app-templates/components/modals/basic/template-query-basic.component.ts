import { Component, Input } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CustomRegexDirective } from "../../../../shared/directives/validation/custom-regex.directive";
import { EnumSelectComponent } from "../../../../shared/components/enum-select/enum-select.component";
import { TemplateAccessLevel } from "../../../enums/template-access-level.enum";
import { TemplateQueryDto } from "../../../dtos/template-query.dto";
import { TemplateGroupDto } from "../../../dtos/template-group.dto";
import { NomenclatureSelectComponent } from "../../../../shared/components/nomenclature-select/nomenclature-select.component";
import { TemplateGroupAddModalComponent } from "../template-group-add-modal.component";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ClickStopPropagation } from "../../../../shared/directives/click-stop-propagation.directive";

@Component({
    standalone: true,
    selector: 'template-query-basic',
    templateUrl: './template-query-basic.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [TranslateModule, FormsModule, NgbTooltip, CustomRegexDirective, EnumSelectComponent, NomenclatureSelectComponent, SyncButtonComponent, ClickStopPropagation]
})
export class TemplateQueryBasicComponent {

    templateAccessLevel = TemplateAccessLevel;

    @Input() templateQueryDto: TemplateQueryDto = new TemplateQueryDto();
    @Input() addingNewTemplate = false;
    @Input() isEditMode = false;

    constructor(
        private modalService: NgbModal,
        public translateService: TranslateService
    ) {
    }

    templateGroupChanged(templateGroupDto: TemplateGroupDto) {
        this.templateQueryDto.templateGroup = templateGroupDto;
        this.templateQueryDto.templateGroupId = templateGroupDto?.id;
        this.templateQueryDto.accessLevel = templateGroupDto?.accessLevel;
    }

    addTemplateGroup() {
        const modal = this.modalService.open(TemplateGroupAddModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });

        return modal.result.then((templateGroupDto: TemplateGroupDto) => {
            if (templateGroupDto) {
                this.templateGroupChanged(templateGroupDto);
            }
        });
    }
}