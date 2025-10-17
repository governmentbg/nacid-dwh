import { Component, Input } from "@angular/core";
import { TemplateGroupSearchDto } from "../../dtos/search/template-group-search.dto";
import { TranslateFieldComponent } from "../../../shared/components/translate-field/translate-field.component";
import { TemplateAccessLevel } from "../../enums/template-access-level.enum";
import { TranslateModule } from "@ngx-translate/core";
import { templateWritePermission } from "../../../auth/constants/permission.constants";
import { PermissionService } from "../../../auth/services/permission.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TemplateGroupEditModalComponent } from "../modals/template-group-edit-modal.component";
import { TemplateGroupDto } from "../../dtos/template-group.dto";
import { ClickStopPropagation } from "../../../shared/directives/click-stop-propagation.directive";
import { PageHandlingService } from "../../../shared/services/page-handling/page-handling.service";
import { Router } from "@angular/router";

@Component({
    standalone: true,
    selector: 'template-group-search-card',
    templateUrl: './template-group-search-card.component.html',
    imports: [TranslateFieldComponent, TranslateModule, ClickStopPropagation]
})
export class TemplateGroupSearchCardComponent {

    hasTemplatesWritePermission = this.permissionService.verifyPermission(templateWritePermission);
    templateAccessLevel = TemplateAccessLevel;

    @Input() templateGroup = new TemplateGroupSearchDto();

    constructor(
        private permissionService: PermissionService,
        private modalService: NgbModal,
        private pageHandlingService: PageHandlingService,
        private router: Router) {
    }

    getTemplateQueries() {
        if (this.templateGroup.templateQueryCount > 0) {
            this.pageHandlingService.scrollToTop();
            this.router.navigate([`/templateQueries/${this.templateGroup.id}`]);
        }
    }

    editTemplateGroup() {
        const modal = this.modalService.open(TemplateGroupEditModalComponent, { backdrop: 'static', size: 'xl', keyboard: false });
        modal.componentInstance.templateGroupId = this.templateGroup.id;

        return modal.result.then((updatedTemplateGroupDto: TemplateGroupDto) => {
            if (updatedTemplateGroupDto) {
                this.templateGroup.description = updatedTemplateGroupDto.description;
                this.templateGroup.descriptionAlt = updatedTemplateGroupDto.descriptionAlt;
                this.templateGroup.name = updatedTemplateGroupDto.name;
                this.templateGroup.nameAlt = updatedTemplateGroupDto.nameAlt;
                this.templateGroup.accessLevel = updatedTemplateGroupDto.accessLevel;
            }
        });
    }
}