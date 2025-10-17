import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ChQueryDto } from "../dtos/ch-query.dto";

@Injectable()
export class ChExportResource {

    url = 'api/ch/export';

    constructor(
        private http: HttpClient
    ) { }

    exportExcel(chQueryDto: ChQueryDto): Observable<Blob> {
        return this.http.post(`${this.url}/excel`, chQueryDto, { responseType: 'blob' })
            .pipe(
                map(response => new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
            );
    }

    exportCsv(chQueryDto: ChQueryDto): Observable<Blob> {
        return this.http.post(`${this.url}/csv`, chQueryDto, { responseType: 'blob' })
            .pipe(
                map(response => new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), response], { type: 'text/csv;charset=utf-8' }))
            );
    }

    exportJson(chQueryDto: ChQueryDto): Observable<Blob> {
        return this.http.post(`${this.url}/json`, chQueryDto)
            .pipe(
                map(response => new Blob([JSON.stringify(response, null, 2)], { type: 'application/json;charset=utf-8' }))
            );
    }

    exportXml(chQueryDto: ChQueryDto): Observable<Blob> {
        return this.http.post(`${this.url}/xml`, chQueryDto, { responseType: 'blob' })
            .pipe(
                map(response => new Blob([response], { type: 'text/xml;charset=utf-8' }))
            );
    }
}