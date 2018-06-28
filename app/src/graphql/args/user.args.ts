import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserArgs {
    @Field({nullable: true, description: 'Get user by id.'})
    public id?: string;

    @Field({nullable: true, description: 'Get user by username.'})
    public username?: string;

    @Field({nullable: true, description: 'Get user by email.'})
    public email?: string;
}
