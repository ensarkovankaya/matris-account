import { IsMongoId } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType()
export class IDInput extends Validatable {

    @Field({description: 'User id.'})
    @IsMongoId()
    public id: string;
}
