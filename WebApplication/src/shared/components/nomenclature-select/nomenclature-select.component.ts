import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { NomenclaturePipe } from "../../pipes/nomenclature.pipe";
import { AutofocusDirective } from "../../directives/autofocus.directive";
import { BaseSelectComponent } from "../base-select/base-select.component";

@Component({
    standalone: true,
    selector: 'nomenclature-select',
    templateUrl: './nomenclature-select.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, TranslateModule, NomenclaturePipe, AutofocusDirective],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NomenclatureSelectComponent),
        multi: true
    }]
})
export class NomenclatureSelectComponent extends BaseSelectComponent {
    @Input() titleText: string = null
    @Input() textTemplate: string = null;

    @HostListener('click', ['$event']) 
    onClick(e?: Event) {
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
                if (this.focusedItem) {
                    this.setValueFromInside(this.focusedItem);
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
        protected override httpClient: HttpClient
    ) {
        super(changeDetectorRef, elementRef, httpClient)
    }

    private clickElement() {
        if (!this.selectOpened) {
            this.filter.limit = this.limit;
            this.filter.offset = 0;
            this.loadOptions();
        }

        this.selectOpened = !this.selectOpened;

        if (!this.selectOpened) {
            this.closeSelect();
        }
    }
}