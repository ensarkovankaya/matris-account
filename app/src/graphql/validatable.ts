import { validateOrReject } from 'class-validator';
import { ValidationError } from "class-validator";
import { ArgsType, ArgumentValidationError as AVE } from 'type-graphql';

export class ArgumentValidationError extends AVE {
    public name = 'ArgumentValidationError';

    constructor(validationErrors: ValidationError[]) {
        super(validationErrors);
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
                skipMissingProperties: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                ...overwrites
            });
        } catch (e) {
            throw new ArgumentValidationError(e);
        }
    }
}
