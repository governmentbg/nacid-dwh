import { ChangeDetectorRef, Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { InputType } from "../../enums/input-type.enum";
import { NumberInputComponent } from "../number-input/number-input.component";
import { DatetimeComponent } from "../date-time/date-time.component";
import { BoolSelectComponent } from "../bool-select/bool-select.component";
import { TextSelectComponent } from "../text-select/text-select.component";
import { OrderByType } from "../../../app-clickhouse/enums/order-by/order-by-type.enum";

@Component({
    standalone: true,
    selector: 'auto-detect-input',
    templateUrl: './auto-detect-input.component.html',
    imports: [FormsModule, NumberInputComponent, DatetimeComponent, TextSelectComponent, BoolSelectComponent],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AutoDetectInputComponent),
        multi: true
    }]
})
export class AutoDetectInputComponent implements ControlValueAccessor {

    inputType = InputType;
    currentInputType = InputType.text;
    orderByType = OrderByType.asc;

    columnType: string;
    @Input('columnType')
    set columnTypeSetter(columnType: string) {
        this.columnType = columnType;

        if (this.columnType) {
            this.setCurrentInputType();
        }
    }

    columnComment: string;
    @Input('columnComment')
    set columnCommentSetter(columnComment: string) {
        this.columnComment = columnComment;

        if (this.columnComment) {
            this.orderByType = this.columnComment.includes('#desc') ? OrderByType.desc : OrderByType.asc;
        } else {
            this.orderByType = OrderByType.asc;
        }
    }

    @Input() textSelectRestUrl: string;
    @Input() model: string = null;
    @Input() formControlClass = 'form-control form-control-sm';
    @Input() disabled = false;
    @Input() required = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    private setCurrentInputType() {

        const columnTypeToLower = this.columnType.toLowerCase();

        if (columnTypeToLower.includes('string')) {
            this.currentInputType = this.inputType.text;
        } else if (columnTypeToLower.includes('int')) {
            this.currentInputType = this.inputType.number;
        } else if (columnTypeToLower.includes('date')) {
            this.currentInputType = this.inputType.date;
        } else if (columnTypeToLower.includes('bool')) {
            this.currentInputType = this.inputType.boolean;
        }
    }

    setValueFromInside(newValue: string) {
        this.model = newValue;
        this.propagateChange(newValue);
        this.propagateTouched();
    }

    // ControlValueAccessor implementation start
    propagateChange = (_: any) => { };
    propagateTouched = () => { };
    registerOnChange(fn: (_: any) => void) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: () => void) {
        this.propagateTouched = fn;
    }
    writeValue(value: any) {
        this.model = value;
        this.changeDetectorRef.detectChanges();
    }
}