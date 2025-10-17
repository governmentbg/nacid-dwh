import { Injectable, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable()
export class SearchUnsubscriberService implements OnDestroy {

    searchSubscriptions: Array<[number, Subscription]> = [];

    addSubscription(searchType: number, subscription: Subscription) {
        this.searchSubscriptions.push([searchType, subscription]);
    }

    unsubscribeByType(searchType: number) {
        this.searchSubscriptions.filter(e => e[0] == searchType).forEach(sub => {
            sub[1].unsubscribe();
        });

        this.searchSubscriptions = this.searchSubscriptions.filter(e => e[0] != searchType);
    }

    unsubscribeAll() {
        this.searchSubscriptions.forEach(sub => {
            sub[1].unsubscribe();
        });

        this.searchSubscriptions = [];
    }

    ngOnDestroy() {
        this.unsubscribeAll();
    }
}