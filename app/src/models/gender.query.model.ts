import { Gender } from './user.model';

export interface IGenderQueryModel {
    eq?: Gender | null;
    in?: Array<Gender | null>;
}
