import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserContextService } from "../../auth/services/user-context.service";
import { ColumnVisualization } from "../../shared/enums/column-visualization.enum";

@Injectable()
export class Configuration {
    defaultLanguage: string;
    ssoClientId: string;
    ssoDomain: string;
    columnVisualization: ColumnVisualization;

    constructor(
        private httpClient: HttpClient,
        private userContextService: UserContextService
    ) { }

    load(): Promise<{}> {
        return new Promise(resolve => {
            this.httpClient.get('../../configuration.json')
                .subscribe(config => {
                    this.importSettings(config);
                    this.userContextService.getUserInfo()
                        .subscribe(() => resolve(true));
                });
        });
    }

    private importSettings(config: any) {
        this.defaultLanguage = config.defaultLanguage;
        this.ssoClientId = config.ssoClientId;
        this.ssoDomain = config.ssoDomain;
        this.columnVisualization = config.columnVisualization;
    }
}