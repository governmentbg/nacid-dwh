import { Component, NgModule } from "@angular/core";
import { NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { LoadingSectionComponent } from "../../shared/components/loading-section/loading-section.component";
import { ActionLogSearchComponent } from "./action-log-search.component";
import { ErrorLogSearchComponent } from "./error-log-search.component";

@Component({
    standalone: true,
    selector: 'log-tabs',
    templateUrl: './log-tabs.component.html',
    imports: [NgbNavOutlet, NgbNav, NgbNavItem, NgbNavContent, NgbNavLink, TranslateModule, LoadingSectionComponent, ActionLogSearchComponent, ErrorLogSearchComponent,],
    providers: [NgModule]
})
export class LogTabsComponent {
    activeTab = 'Error';
}