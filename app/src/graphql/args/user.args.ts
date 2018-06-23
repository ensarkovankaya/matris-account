import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserArgs {
    @Field({nullable: true})
    public id?: string;

    @Field({nullable: true})
    public username?: string;

    @Field({nullable: true})
    public email?: string;
}
