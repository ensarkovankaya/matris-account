import { PaginateResult } from 'mongoose';
import { Field, ObjectType } from 'type-graphql';
import { User } from './user.schema';

@ObjectType()
export class ListResultSchema implements PaginateResult<User> {
    @Field(type => [User], {description: 'Users'})
    public docs: User[];

    @Field({description: 'Total number of data returned from search.'})
    public total: number;

    @Field({description: 'Limited result'})
    public limit: number;

    @Field({nullable: true, description: 'Current page number.'})
    public page?: number;

    @Field({nullable: true, description: 'Total number of pages.'})
    public pages?: number;

    @Field({nullable: true, description: 'Offset'})
    public offset?: number;
}
