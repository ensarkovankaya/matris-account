import { readFileSync } from 'fs';
import { IUserModel, UserField } from './user.model';

export const USERS: IUserModel[] = JSON.parse(readFileSync(__dirname + '/db.json', 'utf8'));

/**
 * Shuffles array in place. ES6 version
 * @param {Array} array: Array containing the items.
 */
const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Makes random choice from array
 * @param {any[]} choices
 * @return {any}
 */
const choose = <T>(choices: T[]) => {
    if (choices.length === 0) {
        throw new Error('Array is empty');
    }
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
};

export interface IUserFilter {
    role?: string;
    gender?: string | null;
}

export interface IMultipleFilter extends IUserFilter {
    shuffle?: boolean;
}

export class UserGenerator {

    private counter: number;

    constructor() {
        this.counter = 0;
    }

    /**
     * Returns one valid user data
     * @param {IUserFilter} filter
     * @return {IUserModel}
     */
    public get(filter: IUserFilter = {}): IUserModel {
        let filtered = USERS.slice();
        if (filter.role) {
            filtered = filtered.filter(u => u.role === filter.role);
        }
        if (filter.gender || filter.gender === null) {
            filtered = filtered.filter(u => u.gender === filter.gender);
        }
        if (filtered.length === 0) {
            throw new Error('User not exists');
        }
        return choose<IUserModel>(filtered);
    }

    /**
     * Returns multiple valid user data
     * Max limit 100.
     * @param {number} limit
     * @param {IMultipleFilter} filter
     * @return {IUserModel[]}
     */
    public multiple(limit: number, filter: IMultipleFilter = {}): IUserModel[] {
        if (limit > 100) {
            throw new Error('Max limit is 100');
        }
        if (limit === 100) {
            return USERS.slice();
        }
        const users: IUserModel[] = [];
        while (users.length < limit) {
            const chosen = this.get(filter);
            if (!users.find(u => u._id === chosen._id)) {
                users.push(chosen);
            }
        }
        return filter.shuffle ? shuffle(users) : users;
    }

    /**
     * Generates partial user. Returns new user object which have only given fields.
     * @param {IUserModel} user
     * @param {string[]} fields: User Fields
     * @return {Partial<IUserModel>}
     */
    public partial(user: IUserModel, fields: UserField[]): Partial<IUserModel> {
        const obj = {};
        fields.forEach(field => obj[field] = user[field]);
        return obj;
    }

    /**
     * Iterates users
     * @return {IterableIterator<IUserModel>}
     */
    public* itter() {
        for (const user of USERS) {
            yield user;
        }
    }
}
