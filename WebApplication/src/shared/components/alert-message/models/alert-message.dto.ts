export class AlertMessageDto {
    alertText: string;
    icon: string;
    customText: string;
    classname: string;
    delay: number;

    constructor(alertText: string, icon: string = 'fa-solid fa-triangle-exclamation', customText: string = null, classname: string = 'bg-danger text-light', delay: number = 10000) {
        this.alertText = alertText;
        this.icon = icon;
        this.customText = customText;
        this.classname = classname;
        this.delay = delay;
    }
}