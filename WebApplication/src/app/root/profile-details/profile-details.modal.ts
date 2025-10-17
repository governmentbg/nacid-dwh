import { Component, HostListener } from "@angular/core";
import { UserContextService } from "../../../auth/services/user-context.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { TranslateModule } from "@ngx-translate/core";
import { CollapsableLabelComponent } from "../../../shared/components/collapsable-label/collapsable-label.component";
import { LanguageSelectComponent } from "../language-select/language-select.component";

@Component({
    standalone: true,
    selector: 'profile-details-modal',
    templateUrl: './profile-details.modal.html',
    imports: [SyncButtonComponent, TranslateModule, CollapsableLabelComponent, LanguageSelectComponent]
})
export class ProfileDetailsModal {

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.decline();
    }

    constructor(
        public userContextService: UserContextService,
        private activeModal: NgbActiveModal) {
    }

    decline() {
        this.activeModal.close(false);
    }
}