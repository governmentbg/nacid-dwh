import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ChTableDto } from "../../../dtos/ch-table.dto";
import { ChOrderByDto } from "../../../dtos/order-by/ch-order-by.dto";
import { ChOutputDto } from "../../../dtos/output/ch-output.dto";
import { FormsModule, NgForm } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CollapsableLabelComponent } from "../../../../shared/components/collapsable-label/collapsable-label.component";
import { SyncButtonComponent } from "../../../../shared/components/sync-button/sync-button.component";
import { OrderByType } from "../../../enums/order-by/order-by-type.enum";
import { TemplateSubquerySearchDto } from "../../../../app-templates/dtos/search/template-subquery-search.dto";
import { ChOrderByResultComponent } from "./ch-order-by-result.component";
import { ArraySelectComponent } from "../../../../shared/components/array-select/array-select.component";
import { EnumSelectComponent } from "../../../../shared/components/enum-select/enum-select.component";

@Component({
    standalone: true,
    selector: 'ch-order-by',
    templateUrl: './ch-order-by.component.html',
    imports: [TranslateModule, CollapsableLabelComponent, FormsModule, SyncButtonComponent, ChOrderByResultComponent, ArraySelectComponent, EnumSelectComponent]
})
export class ChOrderByComponent {

    chOrderByPreparation = new ChOrderByDto();

    orderByType = OrderByType;

    @Input() chSubquery = new TemplateSubquerySearchDto();
    @Input() chTable = new ChTableDto();
    @Input() chOrderBy: ChOrderByDto[] = [];
    @Output() chOrderByChange: EventEmitter<ChOrderByDto[]> = new EventEmitter<ChOrderByDto[]>();

    chOutput: ChOutputDto[];
    @Input('chOutput')
    set chOutputSetter(chOutput: ChOutputDto[]) {
        this.chOutput = chOutput;
        this.chOrderBy = this.chOrderBy.filter(e => this.chOutput.some(s => s.columnAs === e.orderByColumn?.columnAs));
        this.chOrderByChange.emit(this.chOrderBy);
    }

    addOrderBy() {
        this.chOrderBy.push(this.chOrderByPreparation);
        this.chOrderByPreparation = new ChOrderByDto();
    }

    changeOrderBy(index: number) {
        this.chOrderBy[index].orderBy = this.chOrderBy[index].orderBy === this.orderByType.asc ? this.orderByType.desc : this.orderByType.asc;
        this.chOrderByChange.emit(this.chOrderBy);
    }

    removeOrderBy(index: number) {
        this.chOrderBy.splice(index, 1);
        this.chOrderByChange.emit(this.chOrderBy);
    }
}
