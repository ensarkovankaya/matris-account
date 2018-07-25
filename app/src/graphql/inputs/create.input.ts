import {
    IsAlphanumeric,
    IsArray,
    IsBoolean,
    IsEmail,
    IsIn,
    IsLowercase,
    Length,
    Matches,
    ValidateIf
} from "class-validator";
import { Field, InputType } from 'type-graphql';
import { IsDateLike, IsInDateRange } from '../../decorators/date';
import { Gender, Role } from '../../models/user.model';
import { Validatable } from '../validatable';

@InputType({description: 'User creation data.'})
export class CreateInput extends Validatable {

    @Field({description: 'User unique email address.'})
    @IsEmail({}, {message: 'Invalid'})
    public email: string;

    @Field({description: 'User first name. Must be between 2 and 32 characters.'})
    @Matches(new RegExp('^[a-zA-Z ]+$'))
    @Length(2, 32, {message: 'InvalidLength'})
    public firstName: string;

    @Field({description: 'User last name. Must be between 2 and 32 characters.'})
    @Matches(new RegExp('^[a-zA-Z ]+$'))
    @Length(2, 32, {message: 'InvalidLength'})
    public lastName: string;

    @Field(type => Role, {description: 'User role. Can be one of ADMIN, MANAGER, INSTRUCTOR, PARENT or STUDENT.'})
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role: Role;

    @Field({description: 'User password. Must be between 8 and 32 characters.'})
    @Length(8, 32, {message: 'InvalidLength'})
    public password: string;

    @Field({
        nullable: true,
        description: 'User unique username. If not provided will be generated. Must be between 4 and 32 characters.',
    })
    @ValidateIf((object, value) => value !== undefined)
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @Field({nullable: true, description: 'Is user active?'})
    @ValidateIf((object, value) => value !== undefined)
    @IsBoolean()
    public active?: boolean;

    @Field(type => Gender, {nullable: true, description: 'User Gender. MALE or FEMALE'})
    @ValidateIf((object, value) => value !== undefined)
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN])
    public gender?: Gender;

    @Field(type => String, {nullable: true, description: 'User birthday. Can be null if not defined.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsDateLike(true)
    @IsInDateRange(new Date(1950, 1, 1), new Date(2000, 12, 31))
    public birthday?: string | null;

    @Field(type => [String], {nullable: true, description: 'User associated group ids.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsArray()
    @Length(24, 24, {message: 'InvalidIDLength', each: true})
    public groups?: string[];
}
