import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ClickStopPropagation } from '../../directives/click-stop-propagation.directive';

@Component({
    standalone: true,
    selector: 'sync-button',
    templateUrl: 'sync-button.component.html',
    imports: [TranslateModule, NgbTooltip, ClickStopPropagation, ClickStopPropagation]
})
export class SyncButtonComponent {
    @Input() text: string;
    @Input() icon: string;
    @Input() btnClass: string;
    @Input() title: string;
    @Input() ngTitle: string;
    @Input() showTextOnPending = true;
    @Input() disabled: boolean = false;
    @Input() pending = false;

    @Output() btnClickedEvent: EventEmitter<void> = new EventEmitter<void>();

    btnClicked() {
        if (!this.disabled && !this.pending) {
            this.btnClickedEvent.emit();
        }
    }
}
