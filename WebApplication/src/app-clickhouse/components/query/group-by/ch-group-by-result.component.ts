import { TranslateModule } from "@ngx-translate/core";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ChGroupByDto } from "../../../dtos/group-by/ch-group-by.dto";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChGroupByStringModal } from "../modals/ch-group-by-string.modal";
import { ChQueryDto } from "../../../dtos/ch-query.dto";

@Component({
    standalone: true,
    selector: 'ch-group-by-result',
    templateUrl: './ch-group-by-result.component.html',
    imports: [TranslateModule, SyncButtonComponent]
})
export class ChGroupByResultComponent {

    @Input() chQuery: ChQueryDto;
    @Input() chGroupBy: ChGroupByDto[] = [];
    @Output() triggerRemoveGroupBy: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private modalService: NgbModal
    ) {
    }

    removeGroupBy(index: number) {
        this.triggerRemoveGroupBy.emit(index);
    }

    openGroupByModal() {
        const modal = this.modalService.open(ChGroupByStringModal, { backdrop: 'static', size: 'lg', keyboard: false });
        modal.componentInstance.chQuery = this.chQuery;
    }
}