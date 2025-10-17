import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    private readonly DT_FORMAT = 'DD.MM.YYYY';

    parse(value: string): NgbDateStruct {
        if (value) {
            value = value.trim();
            const mdt = moment.utc(value, this.DT_FORMAT);
            if (mdt.isValid()) {
                return {
                    day: mdt.date(),
                    month: mdt.month() + 1,
                    year: mdt.year()
                } as NgbDateStruct;
            }
        }
        return null;
    }

    format(date: NgbDateStruct): string {
        if (!date) {
            return '';
        }
        const mdt = moment.utc([date.year, date.month - 1, date.day]);
        if (!mdt.isValid()) {
            return null;
        }
        return mdt.format(this.DT_FORMAT);
    }
}