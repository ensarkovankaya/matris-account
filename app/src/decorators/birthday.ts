import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Custom validator decorator for validating user birthday.
 * See: https://github.com/typestack/class-validator#custom-validation-decorators
 *
 * @param nullable: if value can be null set this to true
 * @param {Date} minDate: Minimum date can user have
 * @param {Date} maxDate: Maximum date can user have
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export const IsBirthday = (minDate: Date, maxDate: Date, nullable?: boolean,
                           validationOptions?: ValidationOptions) => {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "IsBirthday",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (value === null && nullable) {
                        return true;
                    }
                    const date = new Date(value);
                    if (date.toString() === 'Invalid Date') {
                        return false;
                    }
                    return date >= minDate && date <= maxDate;
                },
                defaultMessage: (validationArguments?: ValidationArguments) => {
                    return 'Invalid Date';
                }
            }
        });
    };
};
