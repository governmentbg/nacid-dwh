import { Component, Input, OnInit } from "@angular/core";
import { LoadingSectionService } from "./loading-section.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    standalone: true,
    selector: 'loading-section',
    templateUrl: 'loading-section.component.html',
    imports: [TranslateModule]
})
export class LoadingSectionComponent implements OnInit {

    @Input() loadingText = 'root.loadingSection.text';
    @Input() iconSize = 'fa-3x';
    @Input() marginSize = '4';

    show: boolean = true;

    constructor(
        private loadingSectionService: LoadingSectionService) {
    }

    ngOnInit() {
        this.loadingSectionService
            .subscribe((value: boolean) => {
                this.show = value;
            });
    }
}