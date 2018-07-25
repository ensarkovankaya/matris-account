import { validateOrReject, ValidationError } from 'class-validator';
import { ArgsType, ArgumentValidationError as AVE } from 'type-graphql';

export class ArgumentValidationError extends AVE {
    public name = 'ArgumentValidationError';
    public errors: { [key: string]: { [key: string]: string } };
    public fields: string[];

    constructor(errors: ValidationError[]) {
        super(errors);
        this.errors = {};
        errors.forEach(err => this.errors[err.property] = err.constraints);
        this.fields = Object.keys(this.errors);
    }

    /**
     * Check field has error
     * @param field
     */
    public hasError(field: string): boolean {
        return field in this.errors;
    }
}

@ArgsType()
export class Validatable {

    constructor(data: object = {}) {
        Object.keys(data).forEach(key => this[key] = data[key]);
    }

    public async validate(overwrites: object = {}) {
        try {
            await validateOrReject(this, {
                skipMissingProperties: false,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                ...overwrites
            });
        } catch (e) {
            throw new ArgumentValidationError(e);
        }
    }
}
