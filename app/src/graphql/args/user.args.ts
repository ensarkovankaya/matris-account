import { IsAlphanumeric, IsEmail, IsLowercase, IsMongoId, Length } from "class-validator";
import { ArgsType, Field } from 'type-graphql';
import { Validatable } from '../validatable';

@ArgsType()
export class UserArgs extends Validatable {
    @Field({nullable: true, description: 'Get user by id.'})
    @IsMongoId()
    public id?: string;

    @Field({nullable: true, description: 'Get user by username.'})
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @Field({nullable: true, description: 'Get user by email.'})
    @IsEmail()
    public email?: string;

    constructor(data = {}) {
        super(data);
    }
}
