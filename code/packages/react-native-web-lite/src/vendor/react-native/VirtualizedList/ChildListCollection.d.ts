export default ChildListCollection;
export class ChildListCollection {
    _cellKeyToChildren: Map<any, any>;
    _childrenToCellKey: Map<any, any>;
    add(list: any, cellKey: any): void;
    remove(list: any): void;
    forEach(fn: any): void;
    forEachInCell(cellKey: any, fn: any): void;
    anyInCell(cellKey: any, fn: any): boolean;
    size(): number;
}
