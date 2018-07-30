import { IsArray, IsIn, ValidateIf } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { IGenderQueryModel } from '../../models/gender.query.model';
import { Gender } from '../../models/user.model';
import { Validatable } from '../validatable';

@InputType({description: 'Gender Query'})
export class GenderQuery extends Validatable implements IGenderQueryModel {
    @Field(type => Gender, {nullable: true, description: 'User gender equals to given value.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN], {message: 'Invalid'})
    public eq?: Gender;

    @Field(type => [Gender], {nullable: true, description: 'User gener is one of given values.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsArray()
    @IsIn([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN], {message: 'Invalid', each: true})
    public in?: Gender[];

    constructor(data = {}) {
        super(data, ['eq', 'in']);
    }
}
