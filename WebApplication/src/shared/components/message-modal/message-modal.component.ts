
import { Component, HostListener, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SyncButtonComponent } from '../sync-button/sync-button.component';

@Component({
    standalone: true,
    templateUrl: './message-modal.component.html',
    imports: [TranslateModule, SyncButtonComponent]
})
export class MessageModalComponent {

    @Input() text: string;
    @Input() text2: string;
    @Input() acceptButton = 'root.buttons.yes';
    @Input() acceptButtonClass = 'btn-sm btn-primary';
    @Input() infoOnly: boolean = false;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler() {
        this.decline();
    }

    constructor(private activeModal: NgbActiveModal) {
    }

    accept() {
        this.activeModal.close(true);
    }

    decline() {
        this.activeModal.close(false);
    }
}
