import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ControlContainer, FormsModule, NgForm } from "@angular/forms";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";
import { ChColumnOutputDto } from "../../../dtos/output/ch-column-output.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";

@Component({
    standalone: true,
    selector: 'tr[ch-partition-over-column]',
    templateUrl: './ch-partition-over-column.component.html',
    viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
    imports: [FormsModule, ArraySelectComponent, SyncButtonComponent]
})
export class ChPartitionOverColumnComponent {

    @Input() partitionOverColumn = new ChColumnOutputDto();
    @Input() normalColumnsOutput: ChOutputDto[] = [];
    @Input() index: number;

    @Output() partitionOverColumnChange: EventEmitter<ChColumnOutputDto> = new EventEmitter<ChColumnOutputDto>();
    @Output() triggerRemove: EventEmitter<void> = new EventEmitter<void>();

    remove() {
        this.triggerRemove.emit();
    }
}