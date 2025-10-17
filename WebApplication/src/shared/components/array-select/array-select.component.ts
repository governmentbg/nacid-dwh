import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NomenclaturePipe } from "../../pipes/nomenclature.pipe";
import { AutofocusDirective } from "../../directives/autofocus.directive";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: 'array-select',
    templateUrl: './array-select.component.html',
    styleUrls: ['./array-select.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslateModule, NomenclaturePipe, AutofocusDirective, CommonModule],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ArraySelectComponent),
        multi: true
    }]
})
export class ArraySelectComponent implements ControlValueAccessor {

    @Input() placeholder: string = null;
    @Input() textTemplate: string = null;
    @Input() disabled = false;
    @Input() allowClear = true;
    @Input() keyProperty = 'id';
    @Input() array: any[] = [];
    @Input() showSearchBox = true;
    @Input() required = false;
    @Input() formControlClass = 'form-control form-control-sm'
    @Input() filterArrayBy: string = 'name';

    @Output() readonly keyPropertyChange = new EventEmitter<number>();

    textFilter: string = null;
    options: any[] = [];
    selectedModel: any = null;
    selectOpened = false;
    loading = false;
    touched = false;

    constructor(
        private elementRef: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    @HostListener('document:click', ['$event']) onClickOutside(event: MouseEvent): void {
        if (this.selectOpened
            && !this.elementRef.nativeElement.contains(event.target)
            && (<HTMLTextAreaElement>event.target).id != 'chevronButton') {
            this.closeSelect();
        }
    }

    @HostListener('click', ['$event']) onClick(e?: Event) {
        if (!this.disabled) {
            if (e && (e.target as Element).className === 'options-item') {
                return;
            }

            this.clickElement();
        }
    }

    @HostListener('keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        if (!this.selectOpened) {
            if (event.key === 'ArrowDown') {
                this.onClick();
            }

            return;
        }

        switch (event.key) {
            case 'Enter':
                this.closeSelect();
                break;
            case 'Escape':
                this.closeSelect();
                break;
        }
    }

    clickElement() {
        if (!this.selectOpened) {
            this.loadOptions();
        }

        this.selectOpened = !this.selectOpened;
    }

    clearSelection(event: Event) {
        this.setValueFromInside(null);
        event.stopPropagation();
    }

    optionsChanged(item: any, event: Event) {
        this.setValueFromInside(item);
        this.closeSelect();
        event.stopPropagation();
    }

    textFilterChange(textFilter: string) {
        this.textFilter = textFilter;
        this.loadOptions();
    }

    private setValueFromInside(newValue: any) {
        this.selectedModel = newValue;
        this.propagateChange(newValue);
        this.keyPropertyChange.emit(newValue ? newValue[this.keyProperty] : null);
        this.propagateTouched();
        this.touched = true;
    }

    private closeSelect() {
        this.selectOpened = false;
        this.textFilter = null;
    }

    private loadOptions() {
        this.loading = true;
        this.options = this.array;
        if (this.filterArrayBy && this.textFilter) {
            this.options = this.options.filter(option => {
                const innerProperties = this.filterArrayBy.split('.');
                let filteredProperty = innerProperties.length ? option : option[this.filterArrayBy];
                innerProperties.forEach(key => filteredProperty = filteredProperty[key]);
                return filteredProperty.toString().toLowerCase().indexOf(this.textFilter?.toLowerCase()) !== -1;
            });
        }

        this.loading = false;
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
        this.selectedModel = value;
        this.changeDetectorRef.detectChanges();
    }
}