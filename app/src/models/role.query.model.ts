import { Role } from './user.model';

export interface IRoleQueryModel {
    eq?: Role;
    in?: Role[];
}
