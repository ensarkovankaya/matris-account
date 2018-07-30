import { IsArray, IsBoolean, Length, ValidateIf } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { IsCompareDateInput } from '../../decorators/is.compare.input';
import { IsGenderQuery } from '../../decorators/is.gender.query';
import { IsRoleQuery } from '../../decorators/is.role.query';
import { IUserFilterModel } from "../../models/user.filter.model";
import { GenderQuery } from '../args/gender.query';
import { RoleQuery } from '../args/role.query';
import { Validatable } from '../validatable';
import { CompareDateInput } from './compare.date.input';

@InputType({description: 'User filter options.'})
export class UserFilterInput extends Validatable {
    @Field({nullable: true, description: 'Is user active?'})
    @ValidateIf((object, value) => value !== undefined)
    @IsBoolean()
    public active?: boolean;

    @Field({nullable: true, description: 'User Gender'})
    @ValidateIf((object, value) => value !== undefined)
    @IsGenderQuery()
    public gender?: GenderQuery;

    @Field({nullable: true, description: 'User Role'})
    @ValidateIf((object, value) => value !== undefined)
    @IsRoleQuery()
    public role?: RoleQuery;

    @Field({nullable: true, description: 'Is user deleted?'})
    @ValidateIf((object, value) => value !== undefined)
    @IsBoolean()
    public deleted?: boolean;

    @Field({nullable: true, description: 'User deleted date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsCompareDateInput()
    public deletedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User created date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsCompareDateInput()
    public createdAt?: CompareDateInput;

    @Field({nullable: true, description: 'User updated date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsCompareDateInput()
    public updatedAt?: CompareDateInput;

    @Field({nullable: true, description: 'User last login date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsCompareDateInput()
    public lastLogin?: CompareDateInput;

    @Field({nullable: true, description: 'User birthday date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsCompareDateInput()
    public birthday?: CompareDateInput;

    @Field(type => [String], {nullable: true, description: 'User associated group ids.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];

    constructor(data: IUserFilterModel) {
        super(data, ['groups', 'birthday', 'lastLogin', 'updatedAt',
            'createdAt', 'deletedAt', 'deleted', 'role', 'gender', 'active']);
    }
}
