export class LoginWithCodeDto {
    authorizationCode: string;

    constructor(authorizationCode: string) {
        this.authorizationCode = authorizationCode;
    }
}