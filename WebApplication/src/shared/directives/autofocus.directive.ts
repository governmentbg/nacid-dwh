import { AfterViewInit, Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: '[autofocus]',
    standalone: true
})
export class AutofocusDirective implements AfterViewInit {

    @Input() autofocus = false;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit(): void {
        if (this.autofocus) {
            this.el.nativeElement.focus();
        }
    }
}