import { registerDecorator, ValidationOptions } from "class-validator";
import { RoleQuery } from '../graphql/args/role.query';

/**
 * Checks is value type of RoleQuery
 * @see https://github.com/typestack/class-validator#custom-validation-decorators
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsRoleQuery = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isRoleQuery",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate: async (value: any) => {
                    try {
                        await new RoleQuery(value).validate();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }
        });
    };
};
