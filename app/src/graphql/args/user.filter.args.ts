import { IsArray, IsBoolean, IsIn, Length } from "class-validator";
import { ArgsType, Field } from 'type-graphql';
import { IsCompareDateInput } from '../../decorators/is.compare.input';
import { IsGenderQuery } from '../../decorators/is.gender.query';
import { IsRoleQuery } from '../../decorators/is.role.query';
import { CompareDateInput } from '../inputs/compare.date.input';
import { Validatable } from '../validatable';
import { GenderQuery } from './gender.query';
import { RoleQuery } from './role.query';

@ArgsType()
export class UserFilterArgs extends Validatable {
    @Field({nullable: true, description: 'Is user active?'})
    @IsBoolean()
    public active?: boolean;

    @Field({nullable: true, description: 'User Gender'})
    @IsGenderQuery()
    public gender?: GenderQuery;

    @Field({nullable: true, description: 'User Role'})
    @IsRoleQuery()
    public role?: RoleQuery;

    @Field({nullable: true, description: 'Is user deleted?'})
    @IsBoolean()
    public deleted?: boolean;

    @Field({nullable: true, description: 'User deleted date'})
    @IsCompareDateInput()
    public deletedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User created date'})
    @IsCompareDateInput()
    public createdAt?: CompareDateInput;

    @Field({nullable: true, description: 'User updated date'})
    @IsCompareDateInput()
    public updatedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User last login date'})
    @IsCompareDateInput()
    public lastLogin?: CompareDateInput;

    @Field({nullable: true, description: 'User birthday date'})
    @IsCompareDateInput()
    public birthday?: CompareDateInput;

    @Field(type => [String], {nullable: true, description: 'User associated group ids.'})
    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];

    constructor(data = {}) {
        super(data);
    }
}
