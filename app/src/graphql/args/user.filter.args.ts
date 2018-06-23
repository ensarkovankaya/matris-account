import { ArgsType, Field, InputType } from 'type-graphql';
import { Gender, Role } from '../../models/user.model';
import { CompareDateInput } from '../inputs/compare.input';

@InputType({description: 'Role Query'})
class RoleQuery {
    @Field(type => Role, {nullable: true, description: 'User role equals to given value.'})
    public eq?: Role;

    @Field(type => [Role], {nullable: true, description: 'User role is one of given values.'})
    public in: Role[];
}

@ArgsType()
export class UserFilterArgs {
    @Field({nullable: true, description: 'Is user active?'})
    public active?: boolean;

    @Field(type => Gender, {nullable: true, description: 'User Gender'})
    public gender?: Gender | null;

    @Field({nullable: true, description: 'User Role'})
    public role?: RoleQuery;

    @Field({nullable: true, description: 'Is user deleted?'})
    public deleted?: boolean;

    @Field({nullable: true, description: 'User deleted date'})
    public deletedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User created date'})
    public createdAt?: CompareDateInput;

    @Field({nullable: true, description: 'User updated date'})
    public updatedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User last login date'})
    public lastLogin?: CompareDateInput;

    @Field({nullable: true, description: 'User birthday date'})
    public birthday?: CompareDateInput;
}
