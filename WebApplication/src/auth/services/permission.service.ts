import { Injectable } from "@angular/core";
import { UserContextService } from "./user-context.service";

@Injectable()
export class PermissionService {

    constructor(private userContextService: UserContextService) {
    }

    verifyUnitPermission(permission: string, unitExternalIds: Array<[string, number]>) {
        return this.userContextService.userContext.organizationalUnits
            .some(e => unitExternalIds
                .some(s => s[0] == e.alias
                    && s[1] == e.externalId
                    && (!permission || e.permissions.indexOf(permission) > -1)));
    }

    verifyOrganizationalUnitsAlias(unitAliases: string[]) {
        return this.userContextService.userContext.organizationalUnits.some(e => unitAliases.indexOf(e.alias) > -1);
    }

    verifyPermission(permission: string) {
        return this.userContextService.userContext.organizationalUnits.some(s => s.permissions.indexOf(permission) > -1);
    }
}