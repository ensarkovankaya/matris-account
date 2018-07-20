import { IsArray, IsIn } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { Role } from '../../models/user.model';
import { Validatable } from '../validatable';

@InputType({description: 'Role Query'})
export class RoleQuery extends Validatable {
    @Field(type => Role, {nullable: true, description: 'User role equals to given value.'})
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public eq?: Role;

    @Field(type => [Role], {nullable: true, description: 'User role is one of given values.'})
    @IsArray()
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid', each: true})
    public in: Role[];

    constructor(data = {}) {
        super(data);
    }
}
