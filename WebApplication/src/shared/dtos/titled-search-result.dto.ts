import { SearchResultDto } from "./search-result.dto";

export class TitledSearchResult<T> extends SearchResultDto<T>
{
    titles: string[] = []
}