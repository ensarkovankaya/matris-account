import { IsNumber, ValidateIf } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType({
    description: 'Compare integer information for given field. ' +
        'Combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareNumberInput extends Validatable {
    @Field(type => Int, {nullable: true, description: 'Equal to number.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber()
    public eq?: number;

    @Field(type => Int, {nullable: true, description: 'Greater than number.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber()
    public gt?: number;

    @Field(type => Int, {nullable: true, description: 'Greater or equal than number.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber()
    public gte?: number;

    @Field(type => Int, {nullable: true, description: 'Less than number.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber()
    public lt?: number;

    @Field(type => Int, {nullable: true, description: 'Less than equal to number.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsNumber()
    public lte?: number;
}
