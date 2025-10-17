import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChColumnFilterDto } from "../filter-dtos/ch-column-filter.dto";
import { SearchResultDto } from "../../shared/dtos/search-result.dto";
import { ChColumnDto } from "../dtos/output/ch-column.dto";
import { Observable } from "rxjs";

@Injectable()
export class ChSchemaResource {

    url = 'api/ch/schema';

    constructor(
        private http: HttpClient
    ) { }

    getTableColumns(table: string, filterDto: ChColumnFilterDto): Observable<SearchResultDto<ChColumnDto>> {
        return this.http.post<SearchResultDto<ChColumnDto>>(`${this.url}/${table}/columns`, filterDto);
    }
}