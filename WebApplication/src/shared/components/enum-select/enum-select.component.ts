import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { EnumSelect } from "./enum-select.model";
import { AutofocusDirective } from "../../directives/autofocus.directive";
import { BaseSelectComponent } from "../base-select/base-select.component";
import { HttpClient } from "@angular/common/http";

@Component({
    standalone: true,
    selector: 'enum-select',
    templateUrl: './enum-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, TranslateModule, AutofocusDirective],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EnumSelectComponent),
        multi: true
    }]
})
export class EnumSelectComponent extends BaseSelectComponent {
    @Input() enumName: string;
    @Input() enumType: any;
    @Input() excludeValues: number[] = [];
    
    allOptions: EnumSelect[] = [];

    @HostListener('click', ['$event']) 
    onClick() {
        if (!this.disabled) {
            this.selectOpened = !this.selectOpened;
            
            if (this.selectOpened) {
                this.loadOptions();
            } else {
                this.closeSelect();
            }
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
                if (this.focusedItem) {
                    this.setValueFromInside(this.focusedItem.value);
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

    constructor(
        protected override changeDetectorRef: ChangeDetectorRef,
        protected override elementRef: ElementRef,
        protected override httpClient: HttpClient,
        private translate: TranslateService
    ) { 
        super(changeDetectorRef, elementRef, httpClient)
    }

    protected override textFilterChange(textFilter: string) {
        if (textFilter.length >= 1) {
            if (textFilter.length > this.textFilter?.length) {
                this.options = this.options.filter(e => e.name.toLowerCase().indexOf(textFilter.toLowerCase()) !== - 1);
            } else {
                this.options = this.allOptions;
                this.options = this.options.filter(e => e.name.toLowerCase().indexOf(textFilter.toLowerCase()) !== - 1);
            }
        } else {
            this.loadOptions();
        }

        this.textFilter = textFilter;
    }

    protected override loadOptions() {
        this.options = [];
        this.allOptions = [];
        Object.keys(this.enumType)
            .filter(Number)
            .forEach(e => {
                this.translate.get(`enums.${this.enumName}.${this.enumType[e]}`)
                    .subscribe(enumLabel => {
                        this.options.push(new EnumSelect(enumLabel, e));
                        this.allOptions.push(new EnumSelect(enumLabel, e));
                    });
            });

        this.excludeValues.forEach((element) => {
            this.options = this.options.filter(e => e.value != element);
        });
    }

    protected override focusUp() {
        const selectedIndex = this.getSelectedIndex();

        var visibleElementsIndexes = this.getIndexesInScroll();

        if (selectedIndex === 0 || selectedIndex === -1) {
            this.focusedItem = this.options[0];
            this.scrollDiv.scrollTop = 0;
            return;
        } else {
            this.focusedItem = this.options[selectedIndex - 1];
        }

        if (visibleElementsIndexes.length >= 7) {
            if (visibleElementsIndexes[1] === selectedIndex){
                this.scrollDiv.scrollTop -= this.getScrollHeight();
            }
        } else {
            if (visibleElementsIndexes[0] === selectedIndex){
                this.scrollDiv.scrollTop -= this.getScrollHeight();
            }
        }

        if (visibleElementsIndexes.indexOf(selectedIndex) === -1) {
            this.focusedItem = this.options[visibleElementsIndexes[1]];
        }
    }

    protected override focusDown() {
        const selectedIndex = this.getSelectedIndex();
        
        var visibleElementsIndexes = this.getIndexesInScroll();

        if (selectedIndex === this.options.length - 1) {
            return;
        }
        
        if (selectedIndex < this.options.length - 1) {
            this.focusedItem = this.options[selectedIndex + 1];
        }
        else {
            this.focusedItem = this.options[0];
            this.scrollDiv.scrollTop = 0;

            return;
        }
        if (selectedIndex != -1 && visibleElementsIndexes.indexOf(selectedIndex) === -1) {
            this.focusedItem = this.options[visibleElementsIndexes[1]];
        }

        if (visibleElementsIndexes.length >= 7) {
            if (visibleElementsIndexes[visibleElementsIndexes.length - 2] === selectedIndex) {
                this.scrollDiv.scrollTop += this.getScrollHeight();
            }
        } else {
            if (visibleElementsIndexes[visibleElementsIndexes.length - 1] === selectedIndex) {
                this.scrollDiv.scrollTop += this.getScrollHeight();
            }
        }
    }
}