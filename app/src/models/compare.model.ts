export interface ICompareDateModel {
    eq?: Date;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
}

export interface INullableCompareDateModel {
    eq?: Date | null;
    gt?: Date;
    gte?: Date;
    lt?: Date;
    lte?: Date;
}

export interface ICompareNumberModel {
    eq?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
}
