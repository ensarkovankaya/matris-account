import { registerDecorator, ValidationOptions } from "class-validator";
import { CompareDateInput } from '../graphql/inputs/compare.date.input';
import { CompareNumberInput } from '../graphql/inputs/compare.number.input';
import { ValidationError } from './error';

/**
 * Checks is value type of CompareNumberInput
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsCompareNumberInput = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isCompareNumberInput",
            target: object.constructor,
            propertyName,
            async: true,
            options: validationOptions,
            validator: {
                validate: async (value: any) => {
                    try {
                        await new CompareNumberInput(value).validate();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }
        });
    };
};

/**
 * Checks is value type of CompareDateInput
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsCompareDateInput = (validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isCompareDateInput",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            async: true,
            validator: {
                validate: async (value: any) => {
                    try {
                        await new CompareDateInput(value).validate();
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            }
        });
    };
};
