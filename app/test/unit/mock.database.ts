import { Logger } from 'matris-logger';
import { Service } from 'typedi';
import { ParameterRequired } from '../../src/graphql/resolvers/user.resolver.errors';
import { getLogger } from '../../src/logger';
import { ICompareModel } from '../../src/models/compare.model';
import { ICreateUserModel, IUpdateUserModel, IUserFilterModel, IUserModel } from '../../src/models/user.model';
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
export class MockDatabase {

    private static compare(data: any[], path: string, filter: ICompareModel): any[] {
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
    public called: string;
    public parameters: { [key: string]: any };

    private logger: Logger;

    constructor() {
        this.logger = getLogger('MockDatabase');
        this.data = [];
    }

    public async create(data: ICreateUserModel): Promise<IUserModel> {
        this.logger.debug('Create', {data});
        this.called = 'create';
        this.parameters = {data};
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
        this.called = 'update';
        this.parameters = {id, data};
        if (!id) {
            throw new ParameterRequired('id');
        }
        this.data = await Promise.all(this.data.map(async user => {
            if (user._id === id) {
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
        this.called = 'delete';
        this.parameters = {id};
        this.data = this.data.filter(user => user._id !== id);
        this.logger.debug('Delete', {data: this.data});
    }

    public async all(filters: IUserFilterModel) {
        this.logger.debug('All', filters);
        this.called = 'all';
        this.parameters = {filters};
        return this.filter(this.data.slice(), filters);
    }

    public async findOne(conditions: IFilterModel) {
        this.logger.debug('FindOne', conditions);
        this.called = 'findOne';
        this.parameters = {conditions};
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
                this.data = await Promise.all(
                    this.shuffle(data.slice(0, options.n)).map(d => this.toUser(d, options.validate))
                );
            } else {
                this.data = await Promise.all(data.map(d => this.toUser(d, options.validate)));
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
    public getOne(): IUserModel {
        if (this.data.length === 0) {
            throw new Error('Data is empty');
        }
        const index = Math.floor(Math.random() * this.data.length);
        return this.data[index];
    }

    private shuffle(array: any[]): any[] {
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
        this.logger.debug('Filter', {data, filters});
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
        if (filters.gender !== undefined) {
            data = data.filter(u => u.gender === filters.gender);
        }
        if (filters.birthday) {
            data = MockDatabase.compare(data, 'birthday', filters.birthday);
        }
        if (filters.deleted !== undefined) {
            data = data.filter(u => u.deleted === filters.deleted);
        }
        if (filters.deletedAt) {
            data = MockDatabase.compare(data, 'deletedAt', filters.deletedAt);
        }
        if (filters.createdAt) {
            data = MockDatabase.compare(data, 'createdAt', filters.createdAt);
        }
        if (filters.updatedAt) {
            data = MockDatabase.compare(data, 'updatedAt', filters.updatedAt);
        }
        if (filters.lastLogin) {
            data = MockDatabase.compare(data, 'lastLogin', filters.lastLogin);
        }
        if (filters.groups && filters.groups.length > 0) {
            data = data.filter(u => u.groups.some(id => filters.groups.indexOf(id) > 0));
        }
        this.logger.debug('Filter', {returnData: data});
        return data;
    }
}
