import { Component, Input } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { FormatNumberPipe } from "../../pipes/format-number.pipe";

@Component({
    standalone: true,
    selector: 'search-result',
    templateUrl: 'search-result.component.html',
    imports: [TranslateModule, FormatNumberPipe]
})
export class SearchResultComponent {

    @Input() offset: number;
    @Input() limit: number;
    @Input() totalCount: number;


}