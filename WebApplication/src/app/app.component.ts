import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { selectedLanguage } from '../shared/constants/language.constants';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { UserContextService } from '../auth/services/user-context.service';
import { Configuration } from './configuration/configuration';
import { UserAuthorizationState } from '../auth/enums/user-authorization-state.enum';
import { LoadingPageComponent } from '../shared/components/loading-page/loading-page.component';
import { AlertContainerComponent } from '../shared/components/alert-message/alert-container.component';
import { ScrollToTopComponent } from './root/scroll-to-top/scroll-to-top.component';
import { HeaderComponent } from './root/header/header.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, LoadingPageComponent, AlertContainerComponent, ScrollToTopComponent, HeaderComponent]
})
export class AppComponent {

  authorizationState = UserAuthorizationState;

  constructor(
    private titleService: Title,
    public userContextService: UserContextService,
    public configuration: Configuration,
    private translateService: TranslateService
  ) {
  }

  private setDefaultLanguage() {
    let language = localStorage.getItem(selectedLanguage);

    if (!language) {
      language = this.configuration.defaultLanguage;
      localStorage.setItem(selectedLanguage, language);
    }

    this.translateService.setDefaultLang(language);
    this.translateService.use(language);
    this.translateService.get('root.title')
      .subscribe(translatedTitle => this.titleService.setTitle(translatedTitle));
  }

  ngOnInit() {
    this.setDefaultLanguage();
  }
}
