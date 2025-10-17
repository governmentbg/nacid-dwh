import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel } from "@angular/forms";

@Component({
    standalone: true,
    selector: 'number-input',
    templateUrl: './number-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NumberInputComponent),
        multi: true
    }]
})
export class NumberInputComponent implements ControlValueAccessor {

    @Input() model: string = null;
    @Input() formControlClass = 'form-control form-control-sm';
    @Input() disabled = false;
    @Input() required = false;
    @Input() placeholder = '';
    @Input() step = 1;
    @Input() returnAsString = false;

    @ViewChild(NgModel) numberInput: NgModel;

    constructor(
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    setValueFromInside(newValue: string) {
        if (this.numberInput.valid) {
            this.model = this.returnAsString ? newValue.toString() : newValue;
            this.propagateChange(this.returnAsString ? newValue.toString() : newValue);
            this.propagateTouched();
        } else {
            this.model = null;
            this.propagateChange(null);
            this.propagateTouched();
        }
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