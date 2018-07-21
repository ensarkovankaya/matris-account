import { PaginateOptions, PaginateResult } from 'mongoose';

export interface IDatabaseModel<T> {
    create(data: object): Promise<T> | T;

    update(id: string, data: object): Promise<void> | void;

    delete(id: string): void;

    all(conditions: object, pagination: PaginateOptions): Promise<PaginateResult<T>> | PaginateResult<T>;

    findOne(conditions: object): Promise<T> | null | T | null;
}
