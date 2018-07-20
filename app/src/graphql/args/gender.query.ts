import { IsArray, IsIn } from "class-validator";
import { Field, InputType } from 'type-graphql';
import { IGenderQueryModel } from '../../models/gender.query.model';
import { Gender } from '../../models/user.model';
import { Validatable } from '../validatable';

@InputType({description: 'Gender Query'})
export class GenderQuery extends Validatable implements IGenderQueryModel {
    @Field(type => Gender, {nullable: true, description: 'User gender equals to given value.'})
    @IsIn([Gender.MALE, Gender.FEMALE, null], {message: 'Invalid'})
    public eq?: Gender | null;

    @Field(type => [Gender], {nullable: true, description: 'User gener is one of given values.'})
    @IsArray()
    @IsIn([Gender.MALE, Gender.FEMALE, null], {message: 'Invalid', each: true})
    public in: Array<Gender | null>;

    constructor(data = {}) {
        super(data);
    }
}