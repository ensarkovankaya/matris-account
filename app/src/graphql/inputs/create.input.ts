import { IsAlphanumeric, IsEmail, IsIn, IsLowercase, Length, MaxDate, MinDate } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { Gender, Role } from '../../models/user.model';
import { User } from '../schemas/user.schema';

@InputType({description: 'User creation data.'})
export class CreateInput implements Partial<User> {

    @Field({description: 'User unique email address.'})
    @IsEmail({}, {message: 'Invalid'})
    public email: string;

    @Field({description: 'User first name. Must be between 2 and 32 characters.'})
    @Length(2, 32, {message: 'InvalidLength'})
    public firstName: string;

    @Field({description: 'User last name. Must be between 2 and 32 characters.'})
    @Length(2, 32, {message: 'InvalidLength'})
    public lastName: string;

    @Field({
        nullable: true,
        description: 'User unique username. If not provided will be generated. Must be between 4 and 32 characters.',
    })
    @Length(4, 32, {message: 'InvalidLength'})
    @IsLowercase({message: 'NotLowercase'})
    @IsAlphanumeric({message: 'NotAlphanumeric'})
    public username?: string;

    @Field(type => Role, {description: 'User role. Can be one of SUPERADMIN, ADMIN, INSTRUCTOR, PARENT or STUDENT.'})
    @IsIn([Role.SUPERADMIN, Role.ADMIN, Role.INSTRUCTOR, Role.PARENT, Role.STUDENT], {message: 'Invalid'})
    public role: Role;

    @Field({description: 'User password.  Must be between 8 and 32 characters.'})
    @Length(8, 32, {message: 'InvalidLength'})
    public password: string;

    @Field({nullable: true, description: 'Is user active?'})
    public active: boolean = true;

    @Field(type => Gender, {nullable: true, description: 'User Gender. MALE or FEMALE'})
    @IsIn([Gender.MALE, Gender.FEMALE])
    public gender: Gender;

    @Field({nullable: true, description: 'User birthday'})
    @MaxDate(new Date())
    @MinDate(new Date('01.01.1960'))
    public birthday: Date;
}
