import { Injectable } from "@angular/core";
import { BaseLogDto } from "./dtos/base/base-log.dto";
import { HttpClient } from "@angular/common/http";
import { SearchResultDto } from "../shared/dtos/search-result.dto";
import { FilterPropDto } from "../shared/filter-dtos/filter-prop.dto";

@Injectable()
export class LogsResource<TLog extends BaseLogDto, TFilter extends FilterPropDto> {

    url = 'api/logs/';

    constructor(
        private http: HttpClient
    ) { }

    init(childUrl: string) {
        this.url = `${this.url}${childUrl}`;
    }

    getAll(filter: TFilter) {
        return this.http.post<SearchResultDto<TLog>>(`${this.url}`, filter);
    }

    getAllCount(filter: TFilter) {
        return this.http.post<number>(`${this.url}/count`, filter);
    }

    getById(id: number) {
        return this.http.get<TLog>(`${this.url}/${id}`);
    }
}