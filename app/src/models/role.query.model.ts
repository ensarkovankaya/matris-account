import { Role } from './role.model';

export interface IRoleQueryModel {
    eq?: Role;
    in?: Role[];
}
