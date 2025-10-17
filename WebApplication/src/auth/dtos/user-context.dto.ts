import { UserAuthorizationState } from "../enums/user-authorization-state.enum";
import { OrganizationalUnitContext } from "./organizational-unit-context.dto";

export class UserContext {
    clientId: string;
    userId: number;
    userName: string;
    fullName: string;
    phoneNumber: string;
    authorizationState: UserAuthorizationState = UserAuthorizationState.logout;
    organizationalUnits: OrganizationalUnitContext[] = [];
}