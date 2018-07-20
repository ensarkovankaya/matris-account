import { registerDecorator, ValidationOptions } from "class-validator";
import { GenderQuery } from '../graphql/args/gender.query';

/**
 * Checks is value type of GenderQuery
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsGenderQuery = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isGenderQuery",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: async (value: any) => {
                    try {
                        await new GenderQuery(value).validate();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }
        });
    };
};
