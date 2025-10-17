import { Injectable } from "@angular/core";
import { ChOutputDto } from "../dtos/output/ch-output.dto";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class OutputChangeService {
    outputChangeSubject = new BehaviorSubject<ChOutputDto[]>([]);

    subscribe(next: (value: ChOutputDto[]) => void) {
        return this.outputChangeSubject.subscribe(next);
    }

    next(value: ChOutputDto[]) {
        return this.outputChangeSubject.next(value);
    }
}