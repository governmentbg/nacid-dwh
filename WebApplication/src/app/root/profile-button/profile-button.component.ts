import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { UserContextService } from "../../../auth/services/user-context.service";
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbNavLink } from "@ng-bootstrap/ng-bootstrap";
import { ClickStopPropagation } from "../../../shared/directives/click-stop-propagation.directive";
import { ProfileDetailsModal } from "../profile-details/profile-details.modal";

@Component({
    standalone: true,
    selector: 'profile-button',
    templateUrl: './profile-button.component.html',
    styleUrls: ['./profile-button.styles.css'],
    imports: [TranslateModule, NgbNavLink, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, ClickStopPropagation]
})
export class ProfileButtonComponent {

    constructor(public userContextService: UserContextService,
        private modalService: NgbModal) {
    }

    openProfileDetailsModal() {
        this.modalService.open(ProfileDetailsModal, { backdrop: 'static', size: 'md', keyboard: false });
    }

    logoutUser() {
        this.userContextService.logout();
    }
}