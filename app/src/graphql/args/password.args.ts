import { IsEmail, Length, Matches } from "class-validator";
import { ArgsType, Field } from 'type-graphql';
import { Validatable } from '../validatable';

@ArgsType()
export class PasswordArgs extends Validatable {
    @Field({description: 'User email.'})
    @IsEmail({}, {message: 'InvalidEmail'})
    public email: string;

    @Field({description: 'User raw password.'})
    @Length(8, 32, {message: 'InvalidLength'})
    @Matches(new RegExp('.*\\S.*', 'g'))
    public password: string;

    constructor(data = {}) {
        super(data);
    }
}
