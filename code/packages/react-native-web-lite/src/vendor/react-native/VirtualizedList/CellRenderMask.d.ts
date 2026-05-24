export class CellRenderMask {
    constructor(numCells: any);
    _numCells: any;
    _regions: any[];
    enumerateRegions(): any[];
    addCells(cells: any): void;
    numCells(): any;
    equals(other: any): boolean;
    _findRegion(cellIdx: any): any[];
}
