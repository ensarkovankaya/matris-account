import { IsDate } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType({
    description: 'Compare date information for given field. ' +
    'You can combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareDateInput extends Validatable {
    @Field({nullable: true, description: 'Equal to date'})
    @IsDate()
    public eq?: Date;

    @Field({nullable: true, description: 'After than date'})
    @IsDate()
    public gt?: Date;

    @Field({nullable: true, description: 'After or equal to date'})
    @IsDate()
    public gte?: Date;

    @Field({nullable: true, description: 'Before than date'})
    @IsDate()
    public lt?: Date;

    @Field({nullable: true, description: 'Before or equal to date.'})
    @IsDate()
    public lte?: Date;

    constructor(data = {}) {
        super(data);
    }
}
