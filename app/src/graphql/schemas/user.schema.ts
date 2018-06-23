import { Field, ID, ObjectType } from 'type-graphql';
import { Gender, Role } from '../../models/user.model';

@ObjectType()
export class User {
    @Field(type => ID, {description: 'User unique ID.'})
    public _id: string;

    @Field({description: 'User unique email address.'})
    public email: string;

    @Field({description: 'User first name.'})
    public firstName: string;

    @Field({description: 'User last name.'})
    public lastName: string;

    @Field({description: 'User unique username.'})
    public username: string;

    @Field({description: 'User creation date.'})
    public createdAt: Date;

    @Field({description: 'User last update date.'})
    public updatedAt: Date;

    @Field({nullable: true, description: 'User delete time.'})
    public deletedAt: Date | null;

    @Field({description: 'Is user deleted?'})
    public deleted: boolean;

    @Field({description: 'User role.'})
    public role: Role;

    @Field({nullable: true, description: 'User last login date.'})
    public lastLogin: Date;

    @Field({nullable: true, description: 'User gender'})
    public gender: Gender;

    @Field({description: 'Is user active?'})
    public active: boolean;

    @Field({nullable: true, description: 'User birthday.'})
    public birthday: Date;
}
