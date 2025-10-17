import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BoolSelectModel } from "./bool-select.model";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  standalone: true,
  selector: 'bool-select',
  templateUrl: './bool-select.component.html',
  styleUrls: ['./bool-select.styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TranslateModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BoolSelectComponent),
    multi: true
  }]
})
export class BoolSelectComponent implements ControlValueAccessor, OnInit {

  @Input() model: boolean = null;
  @Input() nullable = true;
  @Input() formControlClass = 'form-control form-control-sm';
  @Input() disabled = false;
  @Input() required = false;
  @Input() returnAsString = false;
  @Input() labels: string[] = ['booleans.active', 'booleans.inactive', 'booleans.all'];

  valueChanged = false;
  selectOpened = false;
  items: BoolSelectModel[] = [];

  @HostListener('document:click', ['$event']) onClickOutside(event: MouseEvent): void {
    if (this.selectOpened
      && !this.elementRef.nativeElement.contains(event.target)) {
      this.selectOpened = false;
    }
  }

  @HostListener('click', ['$event']) onClick(e?: Event) {
    if (!this.disabled) {
      this.selectOpened = !this.selectOpened;
      this.valueChanged = true;
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
  }

  selectOption(newValue: boolean, event: Event) {
    event.stopPropagation();
    this.model = newValue;
    this.propagateChange(this.returnAsString ? newValue.toString() : newValue);
    this.propagateTouched();
    this.selectOpened = false;
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
    if (typeof (value) === 'string') {
      if (value === 'true') {
        this.model = true;
      } else if (value === 'false') {
        this.model = false;
      } else {
        this.model = null;
      }
    } else {
      this.model = value;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
    this.items.push(new BoolSelectModel(1, this.labels[0], true));
    this.items.push(new BoolSelectModel(2, this.labels[1], false));

    if (this.nullable) {
      this.items.push(new BoolSelectModel(3, this.labels[2], null));
    } else {
      this.labels = this.labels.slice(0, 2);
    }
  }
}