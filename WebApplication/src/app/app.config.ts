import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserContextService } from '../auth/services/user-context.service';
import { AuthResource } from '../auth/auth.resource';
import { Configuration } from './configuration/configuration';
import { LogoutAuthGuard } from './auth-guards/logout-auth-guard';
import { LoginAuthGuard } from './auth-guards/login-auth-guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoadingSectionService } from '../shared/components/loading-section/loading-section.service';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AlertMessageService } from '../shared/components/alert-message/services/alert-message.service';
import { PageHandlingService } from '../shared/services/page-handling/page-handling.service';
import { ChQueryResource } from '../app-clickhouse/resources/ch-query.resource';
import { registerLocaleData } from '@angular/common';
import localeBg from '@angular/common/locales/bg';
import { ChExportResource } from '../app-clickhouse/resources/ch-export.resource';
import { TemplateGroupResource } from '../app-templates/resources/template-group.resource';
import { PermissionService } from '../auth/services/permission.service';
import { PermissionAuthGuard } from './auth-guards/permission.auth-guard';
import { TemplateQueryResource } from '../app-templates/resources/template-query.resource';
import { ChSchemaResource } from '../app-clickhouse/resources/ch-schema.resource';

registerLocaleData(localeBg);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(), withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'bg' },
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [Configuration],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createHttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    Configuration,
    PermissionService,
    PermissionAuthGuard,
    LogoutAuthGuard,
    LoginAuthGuard,
    UserContextService,
    AuthResource,
    LoadingSectionService,
    AlertMessageService,
    PageHandlingService,
    ChQueryResource,
    ChExportResource,
    ChSchemaResource,
    TemplateGroupResource,
    TemplateQueryResource
  ]
};

export function configFactory(config: Configuration) {
  return () => config.load();
}

export function createHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=' + new Date().getTime());
}
