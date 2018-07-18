import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { InvalidDate } from './todate';

/**
 * Custom validator decorator for validating given date is in range.
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 *
 * @param {Date} minDate: Minimum date can user have
 * @param {Date} maxDate: Maximum date can user have
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsInDateRange = (minDate: Date, maxDate: Date, validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isInDateRange",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (!value) {
                        return true;
                    }
                    const date = new Date(value);
                    if (date.toString() === 'Invalid Date') {
                        throw new InvalidDate();
                    }
                    return date >= minDate && date <= maxDate;
                },
                defaultMessage: (validationArguments?: ValidationArguments) => {
                    return `Date not in between ${minDate.toDateString()} to ${maxDate.toDateString()}.`;
                }
            }
        });
    };
};

/**
 * Check given value can be transform to date
 * @param nullable: Can be null
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsDateLike = (nullable: boolean = false, validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "isDateLike",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === null && nullable) {
                        return true;
                    }
                    const date = new Date(value);
                    return date.toString() !== 'Invalid Date';
                },
                defaultMessage: (validationArguments?: ValidationArguments) => {
                    return `Value ${validationArguments.value} is not date like.`;
                }
            }
        });
    };
};
