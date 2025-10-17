import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ChOrderByDto } from "../../../dtos/order-by/ch-order-by.dto";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChOrderByStringModal } from "../modals/ch-order-by-string.modal";
import { CdkDragDrop, DragDropModule } from "@angular/cdk/drag-drop";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { OrderByType } from "../../../enums/order-by/order-by-type.enum";

@Component({
    standalone: true,
    selector: 'ch-order-by-result',
    templateUrl: './ch-order-by-result.component.html',
    imports: [TranslateModule, SyncButtonComponent, DragDropModule]
})
export class ChOrderByResultComponent {

    orderByType = OrderByType;

    @Input() chOrderBy: ChOrderByDto[] = [];
    @Output() triggerRemoveOrderBy: EventEmitter<number> = new EventEmitter<number>();
    @Output() triggerChangeOrderBy: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private modalService: NgbModal
    ) {
    }

    changeOrderBy(index: number) {
        this.triggerChangeOrderBy.emit(index);
    }

    removeOrderBy(index: number) {
        this.triggerRemoveOrderBy.emit(index);
    }

    openOrderByModal() {
        const modal = this.modalService.open(ChOrderByStringModal, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.chOrderBy = this.chOrderBy;
    }

    drop(event: CdkDragDrop<ChOrderByDto[]>) {
        if (event.previousIndex !== event.currentIndex) {
            const movedItem = this.chOrderBy.splice(event.previousIndex, 1)[0];
            this.chOrderBy.splice(event.currentIndex, 0, movedItem);
        }
    }
}