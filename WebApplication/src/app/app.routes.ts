import { Routes } from '@angular/router';
import { LogoutAuthGuard } from './auth-guards/logout-auth-guard';
import { AuthCodeLoginComponent } from '../auth/components/auth-code-login/auth-code-login.component';
import { LoginAuthGuard } from './auth-guards/login-auth-guard';
import { LoginComponent } from '../auth/components/login/login.component';
import { ChReportComponent } from '../app-clickhouse/components/ch-report.component';
import { PermissionAuthGuard } from './auth-guards/permission.auth-guard';
import { systemLogssReadPermission, templateReadPermission } from '../auth/constants/permission.constants';
import { TemplateGroupSearchComponent } from '../app-templates/components/search/template-group-search.component';
import { TemplateQuerySearchComponent } from '../app-templates/components/search/template-query-search.component';
import { LogTabsComponent } from '../logs/components/log-tabs.component';
import { nacidAlias } from '../auth/constants/organizational-unit.constants';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reports'
    },
    {
        path: 'logs',
        component: LogTabsComponent,
        canActivate: [PermissionAuthGuard],
        data: {
            permission: systemLogssReadPermission,
            unitExternals: [
                [nacidAlias, null]
            ]
        }
    },
    {
        path: 'loginCode',
        component: AuthCodeLoginComponent,
        canActivate: [LogoutAuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LogoutAuthGuard]
    },
    {
        path: 'reports',
        component: ChReportComponent,
        canActivate: [LoginAuthGuard]
    },
    {
        path: 'templateGroups',
        component: TemplateGroupSearchComponent,
        canActivate: [PermissionAuthGuard],
        data: {
            permission: templateReadPermission
        }
    },
    {
        path: 'templateQueries/:templateGroupId',
        component: TemplateQuerySearchComponent,
        canActivate: [PermissionAuthGuard],
        data: {
            permission: templateReadPermission
        }
    }
];
