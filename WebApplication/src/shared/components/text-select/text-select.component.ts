import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Input, ViewChild, forwardRef } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { ChColumnValueDto } from "./dto/ch-column-value.dto";
import { NomenclaturePipe } from "../../pipes/nomenclature.pipe";
import { BaseSelectComponent } from "../base-select/base-select.component";

@Component({
    standalone: true,
    selector: 'text-select',
    templateUrl: './text-select.component.html',
    styleUrls: ['./text-select.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslateModule, NomenclaturePipe],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextSelectComponent),
        multi: true
    }]
})
export class TextSelectComponent extends BaseSelectComponent {
    @Input() btnClass = 'btn-primary btn-sm';

    @ViewChild('textInput') textInput: ElementRef;

    textTemplate = '{stringValue}';

    @HostListener('keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                if (this.focusedItem) {
                    this.setValueFromInside(this.focusedItem.stringValue);
                    this.closeSelect();
                    event.preventDefault();
                } else {
                    this.closeSelect();
                    event.preventDefault();
                }
                break;
            case 'Escape':
                this.closeSelect();
                break;
            case 'ArrowUp':
                this.focusUp();
                break;
            case 'ArrowDown':
                this.focusDown();
                break;
        }
    }

    @HostListener('scroll', ['$event'])
    onScroll(event: any) {
        if (!this.loading && this.options && this.options.length < this.totalCount && event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.loadOptions();
        }
    }

    constructor(
        protected override changeDetectorRef: ChangeDetectorRef,
        protected override elementRef: ElementRef,
        protected override httpClient: HttpClient,
    ) { 
        super(changeDetectorRef, elementRef, httpClient) 
    }

    openCloseOptions() {
        if (!this.disabled) {
            this.textInput.nativeElement.focus();
            this.focusedItem = null;

            if (!this.selectOpened) {
                this.filter.limit = this.limit;
                this.filter.offset = 0;
                this.loadOptions();
            }

            this.selectOpened = !this.selectOpened;
        } else {
            this.selectOpened = false;
        }

        this.changeDetectorRef.detectChanges();
    }

    protected override textFilterChange(newValue: string) {
        this.setValueFromInside(newValue);
        this.loadOptions();
        this.selectOpened = true;
    }

    protected override optionsChanged(item: ChColumnValueDto, event: Event) {
        this.setValueFromInside(item.stringValue);
        this.closeSelect();
        event.stopPropagation();
    }
}