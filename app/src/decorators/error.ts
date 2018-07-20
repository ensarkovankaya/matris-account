export class ValidationError extends Error {
    public name = 'ValidationError';

    constructor(public target: object, public value: any, public property: string, public children: Error[]) {
        super();
    }
}
