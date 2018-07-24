import { IsMongoId } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType()
export class DeleteInput extends Validatable {

    @Field({description: 'User id.'})
    @IsMongoId()
    public id: string;
}
