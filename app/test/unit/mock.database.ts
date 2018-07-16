import { readFileSync } from 'fs';
import { Service } from 'typedi';
import { ParameterRequired } from '../../src/graphql/resolvers/user.resolver.errors';
import { ICompareModel } from '../../src/models/compare.model';
import { ICreateUserModel, IUpdateUserModel, IUserFilterModel, IUserModel } from '../../src/models/user.model';
import { User } from '../../src/models/user.schema';
import { DatabaseService } from '../../src/services/database.service';
import { IDBUserModel } from '../data/db.model';

interface IFilterModel extends IUserFilterModel {
    _id?: string;
    email?: string;
    username?: string;
}

@Service()
export class MockDatabase extends DatabaseService {

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

    constructor() {
        super();
        this.data = [];
    }

    public async create(data: ICreateUserModel): Promise<IUserModel> {
        this.logger.debug('Create', {data});
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
        this.data = this.data.filter(user => user._id !== id);
        this.logger.debug('Delete', {data: this.data});
    }

    public async all(filters: IUserFilterModel) {
        this.logger.debug('All', filters);
        return this.filter(this.data.slice(), filters);
    }

    public async findOne(conditions: IFilterModel) {
        this.logger.debug('FindOne', conditions);
        return this.filter(this.data.slice(), conditions)[0] || null;
    }

    /**
     * Loads mock users from db.json
     * @param {number} n: Only load n number of user
     * @param path: Data path
     * @return {Promise<void>}
     */
    public async load(n?: number, path: string = __dirname + '/../data/db.json') {
        try {
            const file = readFileSync(path, {encoding: 'utf8'});
            const users: IDBUserModel[] = JSON.parse(file);
            if (n) {
                this.data = await Promise.all(this.shuffle(users.slice(0, n)).map(data => this.toUser(data)));
            } else {
                this.data = await Promise.all(users.map(data => this.toUser(data)));
            }
            this.logger.debug(`${this.data.length} mock user loaded.`);
        } catch (e) {
            this.logger.error('Mock data could not load.', e);
            throw e;
        }
    }

    /**
     * Returns random choice user from data
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

    private async toUser(data: IDBUserModel): Promise<IUserModel> {
        try {
            const user = new User(data);
            await user.validate();
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
