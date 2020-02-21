export class PageParams {
    tipoId: number;
    pageIndex: number;
    pageSize: number;


    constructor(tipoId: number, index: number, size: number) {
        this.tipoId = tipoId;
        this.pageIndex = index;
        this.pageSize = size;
    }

}