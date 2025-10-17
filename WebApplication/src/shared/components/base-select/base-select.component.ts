import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Output, ViewChildren } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FilterPropDto } from "../../filter-dtos/filter-prop.dto";
import { catchError, Observable, Subscription, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SearchResultDto } from "../../dtos/search-result.dto";

@Component({
    standalone: true,
    selector: 'base-select',
    template: '',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => BaseSelectComponent),
        multi: true
    }]
})
export class BaseSelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    @ViewChildren('scrollDiv') scrollDivQuery: any;
	@ViewChildren('optionsItemDiv') optionsItemDivQuery: any;
    protected scrollDiv: any;

    @Input() selectedModel: any = null;
    @Input() formControlClass = 'form-control form-control-sm';
    @Input() required = false;
    @Input() disabled = false;
    @Input() allowClear = true;
    @Input() showSearchBox = true;
    @Input() keyProperty = 'id';
    @Input() restUrl: string = null;
    @Input() limit = 10;
    @Input() placeholder: string = '';
    @Input() includeInactive = false;

    filter = new FilterPropDto();
    @Input('filter')
    set filterSetter(filter: any) {
        this.filter = filter;
    }

    focusedItem: any;
    options: any[] = [];
    touched = false;
    selectOpened = false;
    textFilter: string = null;
    loading = false;
    totalCount = 0;
    searchSubscription: Subscription = null;

    @Output() readonly keyPropertyChange = new EventEmitter<any>();

    @HostListener('document:click', ['$event']) onClickOutside(event: MouseEvent): void {
        if (this.selectOpened
            && !this.elementRef.nativeElement.contains(event.target)
            && (<HTMLTextAreaElement>event.target).id != 'chevronButton') {
            this.closeSelect();
        }
    }

    @HostListener('document:mouseover', ['$event']) onHover(e?: Event) {
        if (!this.disabled) {
            if (e && (e.target as Element).className === 'options-item') {
                var element = e.target as Element;

                const itemIndex = +element.attributes.getNamedItem("name")?.value;
                
                if (itemIndex || itemIndex == 0) {
                    this.focusedItem = this.options[itemIndex];
                }
            }
        }
    }

    constructor(
        protected changeDetectorRef: ChangeDetectorRef, 
        protected elementRef: ElementRef,
        protected httpClient: HttpClient
    ) {}

    ngAfterViewInit(): void {
        this.scrollDivQuery.changes.subscribe((el: any) => {
            if (el && el._results.length) {
                this.scrollDiv = el._results[0].nativeElement;
            }
        });
    }

    protected setValueFromInside(newValue: any) {
        this.selectedModel = newValue;
        this.propagateChange(newValue);
        this.keyPropertyChange.emit(newValue ? newValue[this.keyProperty] : null);
        this.propagateTouched();
        this.touched = true;
        this.selectOpened = false;
        this.filter.offset = 0;
        this.filter.textFilter = newValue;
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

    protected loadOptions() {
            this.unsubscribeSearch();
            this.loading = true;
    
            this.searchSubscription = this.getFiltered()
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.loading = false;
                        this.closeSelect();
                        return throwError(() => err);
                    })
                )
                .subscribe(e => {
                    const currentElements = e.result;
                    this.totalCount = e.totalCount;
    
                    if (this.filter.offset) {
                        const tempArray = this.options.slice(0);
                        tempArray.push(...currentElements);
                        this.options = tempArray;
                    } else {
                        this.options = currentElements;
                    }
    
                    this.filter.offset = this.options.length;
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                });
    }

    protected getFiltered(): Observable<SearchResultDto<any>> {
        this.filter.isActive = this.includeInactive ? null : true;
        return this.httpClient.post<SearchResultDto<any>>(`api/${this.restUrl}`, this.filter);
    }

    protected textFilterChange(textFilter: string) {
        this.filter.textFilter = textFilter;
        this.filter.offset = 0;
        this.loadOptions();
    }

    protected closeSelect() {
        this.focusedItem = null;
        this.selectOpened = false;
        this.filter.textFilter = null;
        this.textFilter = null;
        this.options = [];
        this.changeDetectorRef.detectChanges();
    }

    protected clearSelection(event: Event) {
        this.setValueFromInside(null);
        event.stopPropagation();
    }

    protected optionsChanged(item: any, event: Event) {
            this.setValueFromInside(item);
            this.closeSelect();
            event.stopPropagation();
    }

    protected focusUp() {
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

    protected focusDown() {
        const selectedIndex = this.getSelectedIndex();
        
        var visibleElementsIndexes = this.getIndexesInScroll();

        if (selectedIndex < this.options.length - 1) {
            this.focusedItem = this.options[selectedIndex + 1];

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
        else if (selectedIndex === this.options.length - 1) {
            if (this.options.length < this.totalCount) {
				this.loadOptions();

                setTimeout(() => {
                    this.focusedItem = this.options[selectedIndex + 1];

                    if (visibleElementsIndexes.length >= 7) {
                        if (visibleElementsIndexes[visibleElementsIndexes.length - 2] === selectedIndex) {
                            this.scrollDiv.scrollTop += this.getScrollHeight();
                        }
                    } else {
                        if (visibleElementsIndexes[visibleElementsIndexes.length - 1] === selectedIndex) {
                            this.scrollDiv.scrollTop += this.getScrollHeight();
                        }
                    }
                }, 500);
            } else {
                return;
            }
        }

        if (selectedIndex != -1 && visibleElementsIndexes.indexOf(selectedIndex) === -1) {
            this.focusedItem = this.options[visibleElementsIndexes[1]];
        }
    }

    protected getIndexesInScroll() {
        let visibleElementIndexes = [];

        for(let i = 0; i < this.optionsItemDivQuery._results.length; i++) {

            if (this.isElementVisible(document.getElementById(`item - ${i}`))) {
                visibleElementIndexes.push(i);
            }
        }

        return visibleElementIndexes;
    }

    protected isElementVisible(el: any) {
        let elRect = el.getBoundingClientRect();
        let elTop = elRect.top;
        let elHeight = elRect.height;

        el = el.parentNode;
        elRect = el.getBoundingClientRect();

        if (elTop <= elRect.bottom === false) return false;
        if ((elTop + elHeight) <= elRect.top) return false

        return elTop <= document.documentElement.clientHeight;
    }

    protected getScrollHeight() {
        const focusedOptions = this.optionsItemDivQuery._results.filter((e: any) => 
            e.nativeElement.className === 'options-item key-focused' || 
            e.nativeElement.className === 'options-item ng-star-inserted key-focused'
        );

        if (focusedOptions && focusedOptions.length) {
			return focusedOptions[0].nativeElement.scrollHeight;
		}
    }

    protected getSelectedIndex() : number {
        if (this.focusedItem) {
            return this.options.indexOf(this.focusedItem) ?? 0;
        } else {
            return this.options.indexOf(this.selectedModel) ?? 0;
        }
    }

    private unsubscribeSearch() {
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.unsubscribeSearch();
    }
}