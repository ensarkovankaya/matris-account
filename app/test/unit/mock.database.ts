import { Service } from 'typedi';
import { ParameterRequired } from '../../src/graphql/resolvers/user.resolver.errors';
import { ICompareModel } from '../../src/models/compare.model';
import { IDatabaseModel } from '../../src/models/database.model';
import { IUserFilterModel, IUserModel } from '../../src/models/user.model';
import { User } from '../../src/models/user.schema';

interface IFilterModel extends IUserFilterModel {
    _id?: string;
    email?: string;
    username?: string;
}

@Service()
export class MockDatabase implements IDatabaseModel<IUserModel> {

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

    private static generateID(length: number = 24) {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let id = '';
        for (let i = 0; i < length; i++) {
            const num = Math.floor(Math.random() * chars.length);
            id += chars.substring(num, num + 1);
        }
        return id;
    }

    private _data: IUserModel[];

    constructor(data: any[] = []) {
        this._data = data;
    }

    public async create(data: Partial<IUserModel>) {
        try {
            const user = new User(data);
            await user.validate();
            this._data.push(user);
            return user;
        } catch (err) {
            console.error('MockDatabase:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: any): Promise<void> {
        if (!id) {
            throw new ParameterRequired('id');
        }
        this._data = await Promise.all(this._data.map(async user => {
            if (user._id === id) {
                try {
                    const updated = new User({...user.toObject(), ...data});
                    await updated.validate();
                    return updated;
                } catch (err) {
                    console.error('MockDatabase:Update', {id, data, user, err});
                    throw err;
                }
            }
            return user;
        }));
    }

    public async delete(id: string) {
        this._data = this._data.filter(user => user._id !== id);
    }

    public async all(filters: IUserFilterModel) {
        return this.filter(this._data.slice(), filters);
    }

    public async findOne(conditions: IFilterModel) {
        return this.filter(this._data.slice(), conditions)[0] || null;
    }

    set data(data: IUserModel[]) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    private filter(data: IUserModel[], filters: IFilterModel): IUserModel[] {
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
        return data;
    }
}
