export class FilterPropDto {
    limit = 30;
    offset = 0;
    getAllData = false;

    textFilter: string;
    isActive: boolean;

    // For paginator
    currentPage = 1;
}