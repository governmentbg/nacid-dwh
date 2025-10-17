import { Injectable } from '@angular/core';
import { AlertMessageDto } from '../models/alert-message.dto';

@Injectable()
export class AlertMessageService {
    alertMessages: AlertMessageDto[] = [];

    show(alertMessage: AlertMessageDto) {
        this.clear();
        this.alertMessages.push(alertMessage);
    }

    remove(alertMessage: AlertMessageDto) {
        this.alertMessages = this.alertMessages.filter((t) => t !== alertMessage);
    }

    clear() {
        this.alertMessages.splice(0, this.alertMessages.length);
    }
}