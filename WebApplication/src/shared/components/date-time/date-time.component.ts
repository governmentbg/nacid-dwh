import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { CustomDateAdapter } from './services/custom-date.adapter';
import { CustomDateParserFormatter } from './services/custom-date.parser';
import { DatepickerLocalizationService } from './services/date-picker.localization';

@Component({
    standalone: true,
    selector: 'date-time',
    templateUrl: 'date-time.component.html',
    styleUrls: ['./date-time.styles.css'],
    imports: [FormsModule, NgbDatepickerModule],
    providers: [
        {
            provide: NgbDateAdapter, useClass: CustomDateAdapter
        },
        {
            provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter
        },
        {
            provide: NgbDatepickerI18n, useClass: DatepickerLocalizationService
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DatetimeComponent,
            multi: true
        }
    ]
})
export class DatetimeComponent implements ControlValueAccessor {
    @Input() startYear = 1930;
    @Input() useEndYear = false;
    @Input() model: string;
    @Input() time: string;
    @Input() disabled = false;
    @Input() changeTime = false;
    @Input() btnClass = 'btn-primary btn-sm';
    @Input() btnTimeClass = 'btn-light btn-sm';
    @Input() formControlClass = 'form-control form-control-sm';
    @Input() inputGroupClass = 'input-group input-group-sm';
    @Input() clearSelectionClass = 'clear-selection';
    @Input() required = false;
    @Input() allowClear = true;
    @Input() datetimeInputGlow = false;

    currentYear = new Date().getFullYear();
    currentMonth = new Date().getMonth() + 1;
    currentDay = new Date().getDate();

    writeValue(value: string) {
        if (value) {
            const mdt = moment.utc(value);
            this.model = mdt.format(moment.HTML5_FMT.DATE);

            if (this.changeTime) {
                const date = new Date(value);
                this.time = this.getFormatedTime(date.getHours(), date.getMinutes());
            }
        } else {
            this.model = null;
            this.time = null;
        }
    }

    propagateChange = (_: any) => { };
    propagateTouched = () => { };
    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: () => void) {
        this.propagateTouched = fn;
    }

    clearSelection(event: Event) {
        this.model = null;
        this.propagateChange(null);
        this.propagateTouched();
        event.stopPropagation();
    }

    changedDate(date: string) {
        const mdt = moment.utc(date);
        if (mdt.isValid() && this.isDateValid(date)) {
            date = this.setTime(date, this.time);
            this.propagateChange(date);
        } else {
            this.propagateChange(null);
        }

        this.propagateTouched();
    }

    changedTime(time: string) {
        const mdt = moment.utc(this.model);
        if (mdt.isValid()) {
            const finalDate = this.setTime(this.model, time);
            if (finalDate !== null) {
                this.propagateChange(finalDate);
                return;
            }
        }
        this.propagateChange(null);
        this.propagateTouched();
    }

    setCurrentTime() {
        const today = new Date();
        this.time = this.getFormatedTime(today.getHours(), today.getMinutes());
        this.changedTime(this.time);
    }

    private setTime(date: string, time: string): string {
        if (!time) {
            return date;
        }
        let fullDate = date;
        const splitted = time.split(':');
        let isValid = splitted.length === 2;
        const hours = +splitted[0];
        const minutes = + splitted[1];
        isValid = isValid
            && !isNaN(hours) && hours >= 0 && hours < 24
            && !isNaN(minutes) && minutes >= 0 && minutes < 60;

        if (!isValid) {
            return null;
        }

        fullDate += ' ' + this.getFormatedTime(hours, minutes);
        return fullDate;
    }

    private getFormatedTime(hours: number, minutes: number): string {
        const hourStr = hours < 10 ? '0' + hours.toString() : hours.toString();
        const minuteStr = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        return hourStr + ':' + minuteStr;
    }

    private isDateValid(date: string): boolean {
        const splitted = date.split('-');
        if (splitted.length != 3)
            return false;
        const days = +splitted[2];
        const months = +splitted[1];
        const years = +splitted[0];

        return days < 32 && months < 13 && (this.startYear ? years > this.startYear : true);
    }
}
