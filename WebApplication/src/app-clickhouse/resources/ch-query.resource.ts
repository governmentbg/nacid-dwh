import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChQueryDto } from "../dtos/ch-query.dto";
import { Observable } from "rxjs";
import { TitledSearchResult } from "../../shared/dtos/titled-search-result.dto";
import { ChOutputDto } from "../dtos/output/ch-output.dto";
import { ChConditionDto } from "../dtos/condition/ch-condition.dto";
import { ChOrderByDto } from "../dtos/order-by/ch-order-by.dto";
import { QueryType } from "../enums/query-type.enum";

@Injectable()
export class ChQueryResource {

    url = 'api/ch/query';

    constructor(
        private http: HttpClient
    ) { }

    getQuery(chQueryDto: ChQueryDto): Observable<TitledSearchResult<any>> {
        return this.http.post<TitledSearchResult<any>>(`${this.url}`, chQueryDto);
    }

    getQueryString(chQueryDto: ChQueryDto): Observable<string> {
        return this.http.post(`${this.url}/string`, chQueryDto, { responseType: 'text' });
    }

    getSelect(queryType: QueryType, output: ChOutputDto[]): Observable<string> {
        return this.http.post(`${this.url}/select/${queryType}`, output, { responseType: 'text' });
    }

    getSingleSelect(queryType: QueryType, output: ChOutputDto): Observable<string> {
        return this.http.post(`${this.url}/singleSelect/${queryType}`, output, { responseType: 'text' });
    }

    getWhere(queryType: QueryType, condition: ChConditionDto[]): Observable<string> {
        return this.http.post(`${this.url}/where/${queryType}`, condition, { responseType: 'text' });
    }

    getGroupBy(chQueryDto: ChQueryDto): Observable<string> {
        return this.http.post(`${this.url}/groupBy`, chQueryDto, { responseType: 'text' });
    }

    getOrderBy(orderBy: ChOrderByDto[]): Observable<string> {
        return this.http.post(`${this.url}/orderBy`, orderBy, { responseType: 'text' });
    }
}