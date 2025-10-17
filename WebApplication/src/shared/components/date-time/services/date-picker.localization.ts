import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

const I18N_VALUES = {
    bg: {
        weekdays: ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед'],
        months: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек']
    },
    en: {
        weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

@Injectable()
export class DatepickerLocalizationService extends NgbDatepickerI18n {

    constructor(private translateService: TranslateService) {
        super();
    }

    getWeekdayLabel(weekday: number): string {
        return this.translateService.currentLang === 'bg' ? I18N_VALUES.bg.weekdays[weekday - 1] : I18N_VALUES.en.weekdays[weekday - 1];
    }

    getMonthShortName(month: number): string {
        return this.translateService.currentLang === 'bg' ? I18N_VALUES.bg.months[month - 1] : I18N_VALUES.en.months[month - 1];
    }

    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
}