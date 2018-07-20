import { IsNumber } from 'class-validator';
import { Field, InputType, Int } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType({
    description: 'Compare integer information for given field. ' +
    'You can combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareNumberInput extends Validatable {
    @Field(type => Int, {nullable: true, description: 'Equal to number.'})
    @IsNumber()
    public eq?: number;

    @Field(type => Int, {nullable: true, description: 'Greater than number.'})
    @IsNumber()
    public gt?: number;

    @Field(type => Int, {nullable: true, description: 'Greater or equal than number.'})
    @IsNumber()
    public gte?: number;

    @Field(type => Int, {nullable: true, description: 'Less than number.'})
    @IsNumber()
    public lt?: number;

    @Field(type => Int, {nullable: true, description: 'Less than equal to number.'})
    @IsNumber()
    public lte?: number;

    constructor(data = {}) {
        super(data);
    }
}
