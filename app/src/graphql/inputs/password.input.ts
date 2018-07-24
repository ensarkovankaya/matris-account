import { IsEmail, Length } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType({description: 'Check password input.'})
export class PasswordInput extends Validatable {
    @Field({description: 'User email.'})
    @IsEmail({}, {message: 'InvalidEmail'})
    public email: string;

    @Field({description: 'User raw password.'})
    @Length(8, 32, {message: 'InvalidLength'})
    public password: string;

    constructor(data = {}) {
        super(data);
    }
}