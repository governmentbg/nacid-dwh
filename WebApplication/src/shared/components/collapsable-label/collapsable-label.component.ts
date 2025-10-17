import { Component, Input } from "@angular/core";
import { ClickStopPropagation } from "../../directives/click-stop-propagation.directive";
import { TranslateModule } from "@ngx-translate/core";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";

@Component({
    standalone: true,
    selector: 'collapsable-label',
    templateUrl: './collapsable-label.component.html',
    styleUrls: ['./collapsable-label.styles.css'],
    imports: [ClickStopPropagation, TranslateModule, NgbCollapse]
})
export class CollapsableLabelComponent {

    @Input() isCollapsed = true;
    @Input() heading: string;
    @Input() class = 'fs-16'
}