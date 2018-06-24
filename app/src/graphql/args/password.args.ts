import { IsEmail, Length } from "class-validator";
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class PasswordArgs {
    @Field({description: 'User email.'})
    @IsEmail({}, {message: 'InvalidEmail'})
    public email: string;

    @Field({description: 'User raw password.'})
    @Length(8, 32, {message: 'InvalidLength'})
    public password: string;
}
