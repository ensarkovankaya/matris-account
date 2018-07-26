import { IsMongoId, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Validatable } from '../validatable';

@InputType()
export class IDInput extends Validatable {

    @Field({description: 'User id.'})
    @IsString()
    @IsMongoId()
    public id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }
}
