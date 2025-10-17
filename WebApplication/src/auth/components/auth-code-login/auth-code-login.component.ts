import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { UserContextService } from "../../services/user-context.service";
import { AuthResource } from "../../auth.resource";
import { UserAuthorizationState } from "../../enums/user-authorization-state.enum";
import { LoginWithCodeDto } from "../../dtos/login/login-with-code.dto";
import { TokenResponseDto } from "../../dtos/token/token-response.dto";
import { LoadingPageComponent } from "../../../shared/components/loading-page/loading-page.component";

@Component({
    standalone: true,
    selector: 'auth-code-login',
    template: '<loading-page></loading-page>',
    imports: [LoadingPageComponent]
})
export class AuthCodeLoginComponent implements OnInit {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userContextService: UserContextService,
        private authResource: AuthResource
    ) {
    }

    private loginWithCode(authorizationCode: string) {
        if (this.userContextService.userContext.authorizationState !== UserAuthorizationState.logout || !authorizationCode) {
            this.clearQueryParams();
            this.router.navigate(['/']);
        } else {
            var loginWithCodeDto = new LoginWithCodeDto(authorizationCode);

            this.authResource.loginWithCode(loginWithCodeDto)
                .pipe(
                    catchError((err) => {
                        this.clearQueryParams();
                        this.userContextService.logout();

                        return throwError(() => err);
                    })
                )
                .subscribe((res: TokenResponseDto) => {
                    this.clearQueryParams();
                    this.userContextService.setToken(res);
                });
        }
    }

    private clearQueryParams() {
        const queryParams: Params = { code: null };

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: queryParams
            });
    }

    ngOnInit() {
        const authorizationCode = this.activatedRoute.snapshot.queryParams['code'];
        this.loginWithCode(authorizationCode);
    }
}