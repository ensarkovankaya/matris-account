export interface IDatabaseModel<T> {
    create(data: object): Promise<T> | T;

    update(id: string, data: object): Promise<void> | void;

    delete(id: string): void;

    all(conditions: object): Promise<T[]> | T[];

    findOne(conditions: object): Promise<T> | null | T | null;
}
