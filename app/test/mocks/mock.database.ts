import { Logger } from 'matris-logger';
import { PaginateOptions } from 'mongoose';
import { Service } from 'typedi';
import { ParameterRequired } from '../../src/errors';
import { getLogger } from '../../src/logger';
import { ICompareDateModel, ICompareNumberModel } from '../../src/models/compare.model';
import { ICreateUserModel } from '../../src/models/create.user.model';
import { IDatabaseModel } from '../../src/models/database.model';
import { IUpdateUserModel } from '../../src/models/update.user.model';
import { IUserFilterModel } from '../../src/models/user.filter.model';
import { IUserModel } from '../../src/models/user.model';
import { User } from '../../src/models/user.schema';
import { IDBUserModel } from '../data/db.model';

interface IFilterModel extends IUserFilterModel {
    _id?: string;
    email?: string;
    username?: string;
}

/**
 * n: Number of user should load from given data
 * validate: validate given data
 */
export interface ILoadOptions {
    n?: number;
    validate?: boolean;
}

@Service()
export class MockDatabase implements IDatabaseModel<IUserModel> {

    private static compare(data: any[], path: string, filter: ICompareDateModel | ICompareNumberModel): any[] {
        if (filter.eq !== undefined) {
            return data.filter(d => d[path] === filter.eq);
        }
        if (filter.gt !== undefined) {
            data = data.filter(d => d[path] > filter.gt);
        } else if (filter.gte !== undefined) {
            data = data.filter(d => d[path] >= filter.gte);
        }

        if (filter.lt !== undefined) {
            data = data.filter(d => d[path] < filter.lt);
        } else if (filter.lte !== undefined) {
            data = data.filter(d => d[path] <= filter.lte);
        }

        return data;
    }

    public data: IUserModel[];
    public callStack: Array<{ method: string, parameters: { [key: string]: any } }>;

    private logger: Logger;

    constructor() {
        this.logger = getLogger('MockDatabase');
        this.data = [];
        this.callStack = [];
    }

    public async create(data: ICreateUserModel): Promise<IUserModel> {
        this.logger.debug('Create', {data});
        this.callStack.push({method: 'create', parameters: {data}});
        try {
            const user = new User(data);
            this.logger.debug('Create', {user});
            await user.validate();
            this.data.push(user);
            return user;
        } catch (err) {
            this.logger.error('Create', err);
            throw err;
        }
    }

    public async update(id: string, data: IUpdateUserModel): Promise<void> {
        this.logger.debug('Update', {id, data});
        this.callStack.push({method: 'update', parameters: {id, data}});

        if (!id) {
            throw new ParameterRequired();
        }
        this.data = await Promise.all(this.data.map(async user => {
            if (user._id.toString() === id.toString()) {
                try {
                    const updated = new User({...user.toObject(), ...data});
                    await updated.validate();
                    this.logger.debug('Update', {updated});
                    return updated;
                } catch (err) {
                    this.logger.error('Update', err, {id, data, user});
                    throw err;
                }
            }
            return user;
        }));
    }

    public async delete(id: string) {
        this.logger.debug('Delete', {id});
        this.callStack.push({method: 'delete', parameters: {id}});
        this.data = this.data.filter(user => user._id !== id);
    }

    public async all(filters: IUserFilterModel, pagination: PaginateOptions) {
        this.logger.debug('All', filters);
        this.callStack.push({method: 'all', parameters: {filters, pagination}});
        const page = pagination.page || 1;
        const limit = pagination.limit || 0;
        const offset = pagination.offset || 0;

        // Filter
        const filtered = this.filter(this.data.slice(), filters);

        if (offset > filtered.length) {
            throw new Error('Offset out of data size.');
        }

        // Offset
        const offseted = filtered.slice(offset);

        const total = offseted.length;

        // Find pages
        let pages: number = 0;
        if (limit >= offseted.length) {
            pages = 1;
        } else {
            let count = 0;
            while (count < offseted.length) {
                count += limit;
                pages += 1;
            }
        }
        const start = limit * (page - 1);
        const end = limit ? start + limit : offseted.length;
        const docs = offseted.slice(start, end);
        return {
            docs,
            total,
            offset,
            limit,
            page,
            pages
        };
    }

    public async findOne(conditions: IFilterModel) {
        this.logger.debug('FindOne', conditions);
        this.callStack.push({method: 'findOne', parameters: {conditions}});
        return this.filter(this.data.slice(), conditions)[0] || null;
    }

    /**
     *
     * @param {IDBUserModel[]} data
     * @param {ILoadOptions} options
     * @return {Promise<void>}
     */
    public async load(data: IDBUserModel[], options: ILoadOptions = {validate: true}) {
        try {
            if (options.n) {
                if (data.length < options.n) {
                    throw new Error('NotEnoughData');
                }
                this.data = await Promise.all(
                    this.shuffle(data.slice(0, options.n)).map(d => this.toUser(d, options.validate))
                );
            } else {
                const users = await Promise.all(data.map(d => this.toUser(d, options.validate)));
                this.data = this.shuffle(users);
            }
            this.logger.debug(`${this.data.length} mock user loaded.`);
        } catch (e) {
            this.logger.error('Mock data could not load.', e);
            throw e;
        }
    }

    /**
     * Returns random user from data
     * @return {IUserModel}
     */
    public getOne(filters: IUserFilterModel = {}): IUserModel {
        if (this.data.length === 0) {
            throw new Error('Data is empty');
        }
        const users = this.filter(this.data, filters);
        if (users.length === 0) {
            throw new Error('No user found with given filters');
        }
        const index = Math.floor(Math.random() * users.length);
        return users[index];
    }

    public shuffle(array: any[]): any[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    private async toUser(data: IDBUserModel, validate: boolean = true): Promise<IUserModel> {
        try {
            const user = new User(data);
            if (validate) {
                await user.validate();
            }
            return user;
        } catch (e) {
            this.logger.error('User validation failed', e, {data});
            throw e;
        }
    }

    private filter(data: IUserModel[], filters: IFilterModel): IUserModel[] {
        this.logger.debug('Filter', {filters});
        try {
            if (filters._id) {
                data = data.filter(d => d._id.toString() === filters._id.toString());
            }
            if (filters.username) {
                data = data.filter(d => d.username === filters.username);
            }
            if (filters.email) {
                data = data.filter(d => d.email === filters.email);
            }
            if (filters.active !== undefined) {
                data = data.filter(u => u.active === filters.active);
            }
            if (filters.role) {
                if (filters.role.eq) {
                    data = data.filter(user => user.role === filters.role.eq);
                } else if (filters.role.in && filters.role.in.length > 0) {
                    data = data.filter(u => filters.role.in.indexOf(u.role) > 0);
                }
            }
            if (filters.gender) {
                if (filters.gender.eq) {
                    data = data.filter(u => u.gender === filters.gender.eq);
                } else if (filters.gender.in) {
                    data = data.filter(u => filters.gender.in.indexOf(u.gender) > 0);
                }
            }
            if (filters.birthday !== undefined) {
                data = MockDatabase.compare(data, 'birthday', filters.birthday);
            }
            if (filters.deleted !== undefined) {
                data = data.filter(u => u.deleted === filters.deleted);
            }
            if (filters.deletedAt !== undefined) {
                data = MockDatabase.compare(data, 'deletedAt', filters.deletedAt);
            }
            if (filters.createdAt) {
                data = MockDatabase.compare(data, 'createdAt', filters.createdAt);
            }
            if (filters.updatedAt) {
                data = MockDatabase.compare(data, 'updatedAt', filters.updatedAt);
            }
            if (filters.lastLogin !== undefined) {
                data = MockDatabase.compare(data, 'lastLogin', filters.lastLogin);
            }
            this.logger.debug('Filter result:', {count: data.length});
            return data;
        } catch (e) {
            this.logger.error('User filtering failed', e, {filters});
            throw e;
        }
    }
}
