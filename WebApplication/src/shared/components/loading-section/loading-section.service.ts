import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class LoadingSectionService {
    loadingSectionSubject = new Subject<boolean>();

    subscribe(next: (value: boolean) => void) {
        return this.loadingSectionSubject.subscribe(next);
    }

    next(value: boolean) {
        return this.loadingSectionSubject.next(value);
    }
}