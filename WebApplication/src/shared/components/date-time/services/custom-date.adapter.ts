import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {

    fromModel(value: string): NgbDateStruct {
        if (!value) {
            return null;
        }
        const mdt = moment.utc(value);
        if (!mdt.isValid()) {
            return null;
        }
        const result = {
            day: mdt.date(),
            month: mdt.month() + 1,
            year: mdt.year()
        } as NgbDateStruct;
        return result;
    }

    toModel(date: NgbDateStruct): string {
        if (!date) {
            return null;
        }
        const momentDate = moment.utc([date.year, date.month - 1, date.day]);
        return momentDate.format(moment.HTML5_FMT.DATE);
    }
}
