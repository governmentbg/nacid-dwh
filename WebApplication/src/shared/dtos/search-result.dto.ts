export class SearchResultDto<T> {
    totalCount: number;
    result: T[] = [];
}