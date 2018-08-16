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
import { Gender } from "../../models/gender.model";
import { Role } from "../../models/role.model";
import { IUpdateUserModel } from "../../models/update.user.model";
import { Validatable } from '../validatable';

@InputType({description: 'User update data.'})
export class UpdateInput extends Validatable {

    @Field({nullable: true, description: 'User unique email address.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsEmail({}, {message: 'Invalid'})
    public email?: string;

    @Field({nullable: true, description: 'User first name.'})
    @ValidateIf((object, value) => value !== undefined)
    @Matches(new RegExp('^[a-zA-Z ]*$'))
    @Length(0, 32, {message: 'InvalidLength'})
    public firstName?: string;

    @Field({nullable: true, description: 'User last name.'})
    @ValidateIf((object, value) => value !== undefined)
    @Matches(new RegExp('^[a-zA-Z ]*$'))
    @Length(0, 32, {message: 'InvalidLength'})
    public lastName?: string;

    @Field({
        nullable: true,
        description: 'User unique username. If not provided will be generated. Must be between 4 and 32 characters.',
    })
    @ValidateIf((object, value) => value !== undefined)
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @Field(type => Role, {
        nullable: true,
        description: 'User role. Can be one of SUPERADMIN, ADMIN, INSTRUCTOR, PARENT or STUDENT.'
    })
    @ValidateIf((object, value) => value !== undefined)
    @IsIn([Role.ADMIN, Role.MANAGER, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role?: Role;

    @Field({nullable: true, description: 'User password. Must be between 8 and 32 characters.'})
    @ValidateIf((object, value) => value !== undefined)
    @Length(8, 40, {message: 'InvalidLength'})
    public password?: string;

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

    @Field({nullable: true, description: 'If true updates user last login date to now.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsBoolean()
    public updateLastLogin?: boolean;

    constructor(input: IUpdateUserModel) {
        const data = input ? {
            ...input,
            birthday: input.birthday ? new Date(input.birthday) : input.birthday
        } : {};
        super(data, ['email', 'role', 'firstName', 'lastName', 'password',
            'username', 'active', 'gender', 'birthday', 'updateLastLogin']);
    }
}
