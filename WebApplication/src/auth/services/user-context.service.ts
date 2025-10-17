import { Injectable } from "@angular/core";
import { UserContext } from "../dtos/user-context.dto";
import { UserAuthorizationState } from "../enums/user-authorization-state.enum";
import { Observable, Observer, catchError, throwError } from "rxjs";
import { AuthResource } from "../auth.resource";
import { Router } from "@angular/router";
import { accessToken } from "../constants/auth.constants";
import { TokenResponseDto } from "../dtos/token/token-response.dto";

@Injectable()
export class UserContextService {
    userContext = new UserContext();

    constructor(
        private router: Router,
        private authResource: AuthResource
    ) {
    }

    setToken(tokenResponseDto: TokenResponseDto) {
        localStorage.setItem(accessToken, tokenResponseDto.access_token);

        return this.getUserInfo().subscribe(() => {
            this.router.navigate(['/']);
        });
    }

    clearUserData() {
        this.userContext = new UserContext();
        localStorage.clear();
    }

    logout() {
        if (this.userContext.authorizationState = UserAuthorizationState.login) {
            this.authResource.logout()
                .pipe(
                    catchError((err) => {
                        this.clearUserData();
                        this.router.navigate(['/login']);
                        return throwError(() => err);
                    })
                )
                .subscribe(() => {
                    this.clearUserData();
                    this.router.navigate(['/login']);
                });
        }
    }

    getUserInfo() {
        this.userContext.authorizationState = UserAuthorizationState.loading;
        return new Observable((observer: Observer<any>) => {
            return this.authResource.getUserInfo()
                .pipe(
                    catchError((err) => {
                        this.clearUserData();
                        observer.next(this.userContext);
                        observer.complete();
                        return throwError(() => err);
                    })
                )
                .subscribe(userContext => {
                    this.userContext = userContext;
                    observer.next(this.userContext);
                    observer.complete();
                });
        });
    }
}