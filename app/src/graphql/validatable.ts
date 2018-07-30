import { validateOrReject, ValidationError } from 'class-validator';
import { ValidatorOptions } from 'class-validator/validation/ValidatorOptions';
import { ArgsType, ArgumentValidationError as AVE } from 'type-graphql';

export class ArgumentValidationError extends AVE {
    public name = 'ArgumentValidationError';
    public errors: { [key: string]: { [key: string]: string } };
    public fields: string[];

    constructor(errors: ValidationError[]) {
        super(errors);
        this.errors = {};
        this.fields = Object.keys(this.errors);
        errors.forEach(err => this.errors[err.property] = err.constraints);
    }

    /**
     * Check field has error. If error is given checks error exists on field
     * @param {string} field: Field name
     * @param {string} error: Error name for the field
     */
    public hasError(field: string, error?: string): boolean {
        if (field in this.errors) {
            return error ? error in this.errors[field] : true;
        }
        return false;
    }
}

@ArgsType()
export class Validatable {

    constructor(data: object = {}) {
        Object.keys(data).forEach(key => this[key] = data[key]);
    }

    public async validate(overwrites: ValidatorOptions = {}) {
        try {
            await validateOrReject(this, {
                skipMissingProperties: false,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                ...overwrites
            });
        } catch (e) {
            if (Array.isArray(e)) {
                throw new ArgumentValidationError(e);
            }
            throw e;
        }
        return this;
    }
}
