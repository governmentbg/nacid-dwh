import { Component } from "@angular/core";
import { SyncButtonComponent } from "../../../shared/components/sync-button/sync-button.component";
import { Configuration } from "../../../app/configuration/configuration";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    standalone: true,
    selector: 'user-login',
    templateUrl: './Login.component.html',
    imports: [SyncButtonComponent, TranslateModule]
})
export class LoginComponent {

    loginPending = false;

    constructor(private configuration: Configuration) {
    }

    requestCode() {
        this.loginPending = true;
        window.open(`${this.configuration.ssoDomain}auth?client_id=${this.configuration.ssoClientId}`, "_self");
    }
}