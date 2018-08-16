import {
    IsAlphanumeric,
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
import { ICreateUserModel } from '../../models/create.user.model';
import { Gender } from "../../models/gender.model";
import { Role } from "../../models/role.model";
import { Validatable } from '../validatable';

@InputType({description: 'User creation data.'})
export class CreateInput extends Validatable {

    @Field({description: 'User unique email address.'})
    @IsEmail({}, {message: 'Invalid'})
    public email: string;

    @Field(type => Role, {description: 'User role. Can be one of ADMIN, MANAGER, INSTRUCTOR, PARENT or STUDENT.'})
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role: Role;

    @Field({description: 'User password. Must be between 8 and 32 characters.'})
    @Length(8, 40, {message: 'InvalidLength'})
    public password: string;

    @Field({nullable: true, description: 'User first name.'})
    @ValidateIf((object, value) => value !== undefined)
    @Matches(new RegExp('^[a-zA-Z ]*$'))
    @Length(0, 32, {message: 'InvalidLength'})
    public firstName: string;

    @Field({nullable: true, description: 'User last name.'})
    @ValidateIf((object, value) => value !== undefined)
    @Matches(new RegExp('^[a-zA-Z ]*$'))
    @Length(0, 32, {message: 'InvalidLength'})
    public lastName: string;

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
    @ValidateIf((object, value) => value !== undefined && value !== null)
    @IsDateLike(true)
    @IsInDateRange(new Date(1950, 1, 1), new Date(2000, 12, 31))
    public birthday?: Date | null;

    constructor(input: ICreateUserModel) {
        const data = input ? {
            ...input,
            birthday: input.birthday ? new Date(input.birthday) : input.birthday
        } : {};
        super(data,
            ['email', 'role', 'firstName', 'lastName', 'password', 'username', 'active', 'gender', 'birthday']
        );
    }
}
