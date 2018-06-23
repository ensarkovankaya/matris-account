import { Field, InputType, Int } from 'type-graphql';

@InputType({
    description: 'Compare integer information for given field. ' +
    'You can combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareNumberInput {
    @Field(type => Int, {nullable: true, description: 'Equal to number.'})
    public eq?: number;

    @Field(type => Int, {nullable: true, description: 'Greater than number.'})
    public gt?: number;

    @Field(type => Int, {nullable: true, description: 'Greater or equal than number.'})
    public gte?: number;

    @Field(type => Int, {nullable: true, description: 'Less than number.'})
    public lt?: number;

    @Field(type => Int, {nullable: true, description: 'Less than equal to number.'})
    public lte?: number;
}

@InputType({
    description: 'Compare date information for given field. ' +
    'You can combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareDateInput {
    @Field({nullable: true, description: 'Equal to date'})
    public eq: Date;

    @Field({nullable: true, description: 'After than date'})
    public gt: Date;

    @Field({nullable: true, description: 'After or equal to date'})
    public gte: Date;

    @Field({nullable: true, description: 'Before than date'})
    public lt: Date;

    @Field({nullable: true, description: 'Before or equal to date.'})
    public lte: Date;
}
