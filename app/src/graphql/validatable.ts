import { validateOrReject } from 'class-validator';
import { ArgsType, ArgumentValidationError } from 'type-graphql';

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
