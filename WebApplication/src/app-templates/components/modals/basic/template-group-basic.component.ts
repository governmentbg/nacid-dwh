import { Component, Input } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { TemplateGroupDto } from "../../../dtos/template-group.dto";
import { TranslateModule } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { CustomRegexDirective } from "../../../../shared/directives/validation/custom-regex.directive";
import { TemplateAccessLevel } from "../../../enums/template-access-level.enum";
import { EnumSelectComponent } from "../../../../shared/components/enum-select/enum-select.component";

@Component({
    standalone: true,
    selector: 'template-group-basic',
    templateUrl: './template-group-basic.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [TranslateModule, FormsModule, NgbTooltip, CustomRegexDirective, EnumSelectComponent]
})
export class TemplateGroupBasicComponent {

    templateAccessLevel = TemplateAccessLevel;

    @Input() templateGroupDto: TemplateGroupDto = new TemplateGroupDto();
    @Input() disableAccessLevel = false;
    @Input() isEditMode = false;

}