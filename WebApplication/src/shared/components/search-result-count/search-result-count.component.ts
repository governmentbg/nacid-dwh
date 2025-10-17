import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchResultComponent } from "../search-result/search-result.component";
import { SyncButtonComponent } from "../sync-button/sync-button.component";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    standalone: true,
    selector: 'search-result-count',
    templateUrl: 'search-result-count.component.html',
    imports: [SearchResultComponent, SyncButtonComponent, CommonModule, TranslateModule]
})
export class SearchResultCountComponent {

    @Input() resultLength = 0;
    @Input() dataCountPending = false;
    @Input() limit: number;
    @Input() offset: number;
    @Input() dataCount: number = null;

    @Output() getCountEvent: EventEmitter<void> = new EventEmitter<void>();
}