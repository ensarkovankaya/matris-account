import { Length } from "class-validator";
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class PasswordArgs {
    @Field({description: 'Unique user id.'})
    @Length(12, 24, {message: 'InvalidLength'})
    public id: string;

    @Field({description: 'User raw password.'})
    @Length(8, 32, {message: 'InvalidLength'})
    public password: string;
}
