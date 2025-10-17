import { Injectable } from "@angular/core";
import { UserAuthorizationState } from "../../auth/enums/user-authorization-state.enum";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserContextService } from "../../auth/services/user-context.service";
import { PermissionService } from "../../auth/services/permission.service";

@Injectable()
export class PermissionAuthGuard {

    authorizationState = UserAuthorizationState;

    constructor(
        public router: Router,
        private userContextService: UserContextService,
        private permissionService: PermissionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (this.userContextService.userContext.authorizationState !== this.authorizationState.login) {
            this.router.navigate(['/']);
            return false;
        } else {
            let permission = route.data['permission'] as string;
            let unitExternals = route.data['unitExternals'] as Array<[string, string]>;

            if (unitExternals?.length > 0) {
                let unitExternalIds: Array<[string, number]> = [];

                unitExternals.forEach(e => {
                    let unitExternalId: [string, number] = [e[0], e[1] ? +route.paramMap.get(e[1]) : null];
                    unitExternalIds.push(unitExternalId);
                });

                if (this.permissionService.verifyUnitPermission(permission, unitExternalIds)) {
                    return true;
                } else {
                    this.router.navigate(['/']);
                    return false;
                }
            } else {
                if (this.permissionService.verifyPermission(permission)) {
                    return true;
                } else {
                    this.router.navigate(['/']);
                    return false;
                }
            }
        }
    }
}