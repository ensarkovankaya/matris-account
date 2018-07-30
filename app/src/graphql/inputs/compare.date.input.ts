import { IsDate, ValidateIf } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ICompareDateModel } from '../../models/compare.model';
import { Validatable } from '../validatable';

@InputType({
    description: 'Compare date information for given field. ' +
        'Combine two field such as "gt" and "lt" to make range operations.'
})
export class CompareDateInput extends Validatable {
    @Field({nullable: true, description: 'Equal to date or null'})
    @ValidateIf((object, value) => value !== undefined && value !== null)
    @IsDate()
    public eq?: Date | null;

    @Field({nullable: true, description: 'After than date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsDate()
    public gt?: Date;

    @Field({nullable: true, description: 'After or equal to date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsDate()
    public gte?: Date;

    @Field({nullable: true, description: 'Before than date'})
    @ValidateIf((object, value) => value !== undefined)
    @IsDate()
    public lt?: Date;

    @Field({nullable: true, description: 'Before or equal to date.'})
    @ValidateIf((object, value) => value !== undefined)
    @IsDate()
    public lte?: Date;

    constructor(data: ICompareDateModel) {
        super(data, ['eq', 'gt', 'gte', 'lt', 'lte']);
    }
}
