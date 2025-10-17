import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthorizationState } from '../../auth/enums/user-authorization-state.enum';
import { UserContextService } from '../../auth/services/user-context.service';

@Injectable()
export class LogoutAuthGuard {

    authorizationState = UserAuthorizationState;

    constructor(
        public router: Router,
        private userContextService: UserContextService
    ) { }

    canActivate(): boolean {
        if (this.userContextService.userContext.authorizationState !== this.authorizationState.logout) {
            this.router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}
