import { Injectable } from "@angular/core";

@Injectable()
export class PageHandlingService {

    scrollToTop() {
        window.scrollTo({ behavior: "smooth", top: 0, left: 0 });
    }

}