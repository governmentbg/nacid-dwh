import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserContext } from "./dtos/user-context.dto";
import { LoginWithCodeDto } from "./dtos/login/login-with-code.dto";
import { TokenResponseDto } from "./dtos/token/token-response.dto";

@Injectable()
export class AuthResource {

    url = 'api/auth';

    constructor(
        private http: HttpClient
    ) { }

    getUserInfo(): Observable<UserContext> {
        return this.http.get<UserContext>(`${this.url}/userinfo`);
    }

    loginWithCode(loginWithCodeDto: LoginWithCodeDto): Observable<TokenResponseDto> {
        return this.http.post<TokenResponseDto>(`${this.url}/authToken`, loginWithCodeDto);
    }

    logout() {
        return this.http.delete(`${this.url}/logout`)
    }
}