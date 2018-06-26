import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Birthday validator. Validates is birthday in given
 * @param {string} property
 * @param nullable
 * @param {Date} minDate
 * @param {Date} maxDate
 * @param {ValidationOptions} validationOptions
 * @return {(object: object, propertyName: string) => void}
 * @constructor
 */
export function IsBirthday(property: string, minDate: Date, maxDate: Date, nullable: boolean = true, validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: "IsBirthday",
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (value === null && nullable) {
                        return true;
                    }
                    const date = new Date(value);
                    if (date.toString() === 'Invalid Date') {
                        return false;
                    }
                    return date > minDate && date < maxDate;
                }
            }
        });
    };
}
