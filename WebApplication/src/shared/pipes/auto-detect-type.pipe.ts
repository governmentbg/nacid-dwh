import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";

@Pipe({
    standalone: true,
    name: 'autoDetectTypePipe'
})
export class AutoDetectTypePipe implements PipeTransform {
    constructor(private translateService: TranslateService) {}

    transform(value: any, format: string = 'dd-MM-yyyy') {
        if (value == null) {
            return '';
        } else if (typeof value === 'boolean') {
            return value
                ? this.translateService.instant('booleans.active')
                : this.translateService.instant('booleans.inactive');
        } else if (!isNaN(value)) {
            return value;
        } else if (moment(value, moment.ISO_8601).isValid()) {
            return new DatePipe('bg-BG').transform(value, format);
        }

        return value;
    }
}