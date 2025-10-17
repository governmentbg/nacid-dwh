import { Component } from '@angular/core';
import { AlertMessageService } from './services/alert-message.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
    standalone: true,
    selector: 'alert-container',
    templateUrl: 'alert-container.component.html',
    host: { class: 'toast-container position-fixed top-0 end-0 p-3 cursor-pointer', style: 'z-index: 9999' },
    imports: [TranslateModule, NgbToast]
})
export class AlertContainerComponent {

    constructor(public alertMessageService: AlertMessageService) {
    }
}