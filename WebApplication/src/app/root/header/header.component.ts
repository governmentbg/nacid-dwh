import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { UserAuthorizationState } from "../../../auth/enums/user-authorization-state.enum";
import { UserContextService } from "../../../auth/services/user-context.service";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgbNav, NgbNavItem, NgbNavLink } from "@ng-bootstrap/ng-bootstrap";
import { ProfileButtonComponent } from "../profile-button/profile-button.component";
import { PermissionService } from "../../../auth/services/permission.service";
import { systemLogssReadPermission, templateReadPermission } from "../../../auth/constants/permission.constants";

@Component({
    standalone: true,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.styles.css'],
    imports: [RouterModule, TranslateModule, CommonModule, NgbNav, NgbNavItem, NgbNavLink, ProfileButtonComponent]
})
export class HeaderComponent {

    authorizationState = UserAuthorizationState;
    hasTemplatesReadPermission = this.permissionService.verifyPermission(templateReadPermission);
    hasSystemLogsReadPermission = this.permissionService.verifyPermission(systemLogssReadPermission)

    @ViewChild('toggleBtn', { static: false }) toggleBtn: ElementRef;
    @ViewChild("collapseContainer", { static: false }) collapseContainer: ElementRef;

    @HostListener('document:click', ['$event']) onClickOutside(): void {
        if (this.collapseContainer
            && this.collapseContainer.nativeElement.classList.contains('show')) {
            this.toggleBtn.nativeElement.click();
        }
    }

    constructor(
        public userContextService: UserContextService,
        private permissionService: PermissionService
    ) {
    }
}