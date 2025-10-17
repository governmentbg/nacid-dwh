import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'translate-field',
    templateUrl: 'translate-field.component.html',
    imports: [TranslateModule]
})
export class TranslateFieldComponent {

    @Input() bgProperty: any = null;
    @Input() enProperty: any = null;
    @Input() class: string;

    constructor(public translateService: TranslateService) {
    }
}
