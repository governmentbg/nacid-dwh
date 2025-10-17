import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    standalone: true,
    selector: 'translate-enum',
    templateUrl: 'translate-enum.component.html',
    imports: [TranslateModule, CommonModule]
})
export class TranslateEnumComponent implements OnChanges {

    text: string = null;

    @Input() model: any = null;
    @Input() enumName: string;
    @Input() enumType: any;
    @Input() class: string;

    constructor(public translateService: TranslateService) {
    }

    ngOnChanges() {
        if (this.model) {
            this.text = `enums.${this.enumName}.${this.enumType[this.model]}`;
        }
    }
}
