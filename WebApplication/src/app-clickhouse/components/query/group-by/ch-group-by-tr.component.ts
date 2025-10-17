import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChColumnOutputDto } from "../../../dtos/output/ch-column-output.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";

@Component({
    standalone: true,
    selector: 'tr[ch-group-by-tr]',
    templateUrl: './ch-group-by-tr.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [TranslateModule, FormsModule, SyncButtonComponent, ArraySelectComponent]
})
export class ChGroupByTrComponent {

    @Input() chOutputGrouping: ChOutputDto[] = [];
    @Input() groupByColumn: ChColumnOutputDto = null;
    @Input() index: number;

    @Output() groupByColumnChange: EventEmitter<ChColumnOutputDto> = new EventEmitter<ChColumnOutputDto>();
    @Output() triggerRemove: EventEmitter<void> = new EventEmitter<void>();

    remove() {
        this.triggerRemove.emit();
    }
}