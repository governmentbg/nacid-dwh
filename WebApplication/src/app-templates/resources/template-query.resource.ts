import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TemplateQueryCreateDto } from "../dtos/template-query-create.dto";
import { Observable } from "rxjs";
import { TemplateQueryDto } from "../dtos/template-query.dto";
import { TemplateQueryFilterDto } from "../filter-dtos/template-query-filter.dto";
import { SearchResultDto } from "../../shared/dtos/search-result.dto";
import { ChQueryDto } from "../../app-clickhouse/dtos/ch-query.dto";

@Injectable()
export class TemplateQueryResource {

    url = 'api/templateQueries';

    constructor(
        private http: HttpClient
    ) { }

    getById(templateQueryId: number) {
        return this.http.get<TemplateQueryDto>(`${this.url}/${templateQueryId}`);
    }

    getSearchResultDto(filter: TemplateQueryFilterDto): Observable<SearchResultDto<TemplateQueryDto>> {
        return this.http.post<SearchResultDto<TemplateQueryDto>>(`${this.url}/search`, filter);
    }

    create(templateQueryCreateDto: TemplateQueryCreateDto): Observable<TemplateQueryDto> {
        return this.http.post<TemplateQueryDto>(`${this.url}`, templateQueryCreateDto);
    }

    update(templateQueryDto: TemplateQueryDto): Observable<TemplateQueryDto> {
        return this.http.put<TemplateQueryDto>(`${this.url}`, templateQueryDto);
    }

    updateQuery(templateQueryId: number, queryDto: ChQueryDto): Observable<TemplateQueryDto> {
        return this.http.put<TemplateQueryDto>(`${this.url}/${templateQueryId}`, queryDto)
    }

    delete(templateQueryId: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${templateQueryId}`);
    }

    moveToGroup(id: number, newGroupId: number) {
        return this.http.put<TemplateQueryDto>(`${this.url}/moveGroup/${id}`, { templateGroupId: newGroupId });
    }    

    copyToGroup(id: number, newGroupId: number) {
        return this.http.post<TemplateQueryDto>(`${this.url}/copyToGroup/${id}`, { templateGroupId: newGroupId });
    }  
}