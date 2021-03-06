import { IsAlphanumeric, IsEmail, IsLowercase, IsMongoId, Length, ValidateIf } from "class-validator";
import { ArgsType, Field } from 'type-graphql';
import { Validatable } from '../validatable';

@ArgsType()
export class UserArgs extends Validatable {
    @Field({nullable: true, description: 'Get user by id.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsMongoId()
    public id?: string;

    @Field({nullable: true, description: 'Get user by username.'})
    @ValidateIf((object, value) => value !== undefined)
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @Field({nullable: true, description: 'Get user by email.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsEmail()
    public email?: string;

    constructor(data = {}) {
        super(data, ['id', 'username', 'email']);
    }
}
