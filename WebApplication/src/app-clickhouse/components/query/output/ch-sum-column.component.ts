import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ChColumnOutputDto } from "../../../dtos/output/ch-column-output.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";

@Component({
    standalone: true,
    selector: 'tr[ch-sum-column]',
    templateUrl: './ch-sum-column.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, ArraySelectComponent, SyncButtonComponent]
})
export class ChSumColumnComponent {

    @Input() sumColumn = new ChColumnOutputDto();
    @Input() sumColumnsOutput: ChOutputDto[] = [];
    @Input() index: number;

    @Output() sumColumnChange: EventEmitter<ChColumnOutputDto> = new EventEmitter<ChColumnOutputDto>();
    @Output() triggerRemove: EventEmitter<void> = new EventEmitter<void>();

    remove() {
        this.triggerRemove.emit();
    }
}