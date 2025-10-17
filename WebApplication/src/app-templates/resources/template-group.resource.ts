import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TemplateGroupFilterDto } from "../filter-dtos/template-group-filter.dto";
import { SearchResultDto } from "../../shared/dtos/search-result.dto";
import { Observable } from "rxjs";
import { TemplateGroupSearchDto } from "../dtos/search/template-group-search.dto";
import { TemplateGroupDto } from "../dtos/template-group.dto";

@Injectable()
export class TemplateGroupResource {

    url = 'api/templateGroups';

    constructor(
        private http: HttpClient
    ) { }

    getById(templateGroupId: number) {
        return this.http.get<TemplateGroupDto>(`${this.url}/${templateGroupId}`);
    }

    getSearchResultDto(filter: TemplateGroupFilterDto): Observable<SearchResultDto<TemplateGroupSearchDto>> {
        return this.http.post<SearchResultDto<TemplateGroupSearchDto>>(`${this.url}/search`, filter);
    }

    create(templateGroupDto: TemplateGroupDto): Observable<TemplateGroupDto> {
        return this.http.post<TemplateGroupDto>(`${this.url}`, templateGroupDto);
    }

    update(templateGroupDto: TemplateGroupDto): Observable<TemplateGroupDto> {
        return this.http.put<TemplateGroupDto>(`${this.url}`, templateGroupDto);
    }
}