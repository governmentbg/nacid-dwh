import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { selectedLanguage } from "../../../shared/constants/language.constants";

@Component({
    standalone: true,
    selector: 'language-select',
    templateUrl: 'language-select.component.html',
    imports: [TranslateModule]
})
export class LanguageSelectComponent {

    constructor(
        public translateService: TranslateService,
        private titleService: Title
    ) {
    }

    changeLanguage(language: string) {
        localStorage.setItem(selectedLanguage, language);
        this.translateService.use(language);
        this.translateService.get('root.title')
            .subscribe(translatedTitle => this.titleService.setTitle(translatedTitle));
    }
}
