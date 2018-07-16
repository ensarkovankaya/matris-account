import { readFileSync } from 'fs';
import { IUserModel, UserField } from './user.model';

const USERS: IUserModel[] = JSON.parse(readFileSync('test/data/valid.json', 'utf8'));

// Group ids
const GROUPS: string[] = [
    'IN1NFAZ2NlcdQKnknJ632rq7',
    'MxmXdcHjz2Hm914jAM8XsNtY',
    'qZS0yyG9huFPfMDK5erflQRw',
    'zs9wK8J3YmUiseO7m3Dezj2n',
    'R7T1zWfc5FiZ8nViYaYKQiFx',
    'weEFNEu7eoG04I2ktwp593Kf',
    'oBReCBDEn8jzvJ9fmz1Bk6Rr',
    '924bRMCWrlkrEsjGuoRb4KCM',
    'NJNEo4ZBhuve4Pw47y9tV9Qa',
    'AjxJQlEKZzkST3C4b1fE6FgV',
    'SeOtFel5zNYQt5utYlidQOss',
    'kIQr53FcQGiiI6MFtl7Q1lYv',
    '810gDNf6xspAhDvIIOfNXATc',
    '7wWAvU0FiV0s2UNH5nvgzIRZ',
    'NZkMs1jnUllwwvkJlhjSUux1',
    'QrHZO4Pk8D3mC1iVlJAnyqWP',
    '65ojiILsLpiRDLCpif839o3r',
    'f9azdpcGDy9vEC15ch4CII8L',
    'QIEFj1fPyqcuxiZ7lCT0reQD',
    'jp1ERjtijMzSwtjX7ib4GwKx',
    'YnFR1wprDhbk8ddw06U0rUOU',
    'xYWw6IHKL93BZfQAP1g5Loe7',
    'KoTvER8ivsVN8XWaPCmbLdXo',
    '59zmqeh6yAGhASmJ4V35iWqq',
    'xOsC25HWAJpWSTOdwTWpPSzP',
    '5SKhQY6uc9qo9ezMV8R0dYXf',
    'iADgnvdwvPKBKhMGTspb6cwD',
    'KIR2esWXz3wgXIf8djTdklhd',
    'lIoSW4y3GjJEnygzwN2i6H7h',
    '76xzryRqhtAXLP9j4e7hJF7m'
];

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
