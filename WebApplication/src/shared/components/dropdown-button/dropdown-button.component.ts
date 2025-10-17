import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbNavLink } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { ClickStopPropagation } from "../../directives/click-stop-propagation.directive";
import { Component, Input } from "@angular/core";

@Component({
    standalone: true,
    selector: 'dropdown-button',
    templateUrl: './dropdown-button.component.html',
    imports: [TranslateModule, NgbNavLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, ClickStopPropagation]
})
export class DropdownButtonComponent {

    @Input() icon: string;
    @Input() text: string;
    @Input() btnClass = 'btn-outline-primary btn-sm';
    @Input() fromEnd = false;
    @Input() loading = false;
    @Input() disabled = false;
}