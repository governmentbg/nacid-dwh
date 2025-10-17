import { Component, HostListener, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { PageHandlingService } from "../../../shared/services/page-handling/page-handling.service";
import { ClickStopPropagation } from "../../../shared/directives/click-stop-propagation.directive";

@Component({
    standalone: true,
    selector: 'scroll-to-top',
    templateUrl: 'scroll-to-top.component.html',
    host: { class: 'position-fixed bottom-0 end-0 p-4 cursor-pointer', style: 'z-index: 9994' },
    imports: [TranslateModule, ClickStopPropagation]
})
export class ScrollToTopComponent implements OnInit {

    showButton = false;

    @HostListener("window:scroll", ["$event"])
    public onScroll(): void {
        this.setShowButon();
    }

    constructor(
        public pageHandlingService: PageHandlingService
    ) {
    }

    private setShowButon() {
        this.showButton = window.scrollY > 0;
    }

    ngOnInit() {
        this.setShowButon();
    }
}