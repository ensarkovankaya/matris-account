import { DocumentQuery } from 'mongoose';
import { Service } from 'typedi';
import { ICompareModel } from '../models/compare.model';
import { IDatabaseModel } from '../models/database.model';
import { IUserFilterModel, IUserModel } from '../models/user.model';
import { User } from '../models/user.schema';

export const compareFilter = (query: DocumentQuery<any[], any>, path: string, filter: ICompareModel):
    DocumentQuery<any[], any> => {
    if (filter.eq !== undefined) {
        return query.where(path, filter.eq);
    }
    if (filter.gt !== undefined) {
        query = query.where(path).gt(filter.gt as number);
    } else if (filter.gte !== undefined) {
        query = query.where(path).gte(filter.gte as number);
    }
    if (filter.lt !== undefined) {
        query = query.where(path).lt(filter.lt as number);
    } else if (filter.lte !== undefined) {
        query = query.where(path).lte(filter.lte as number);
    }
    return query;
};

@Service()
export class DatabaseService implements IDatabaseModel<IUserModel> {

    public async create(data: object): Promise<IUserModel> {
        try {
            return await new User({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            }).save({validateBeforeSave: true});
        } catch (err) {
            console.error('DatabaseService:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: object): Promise<void> {
        try {
            await User.findByIdAndUpdate(id, {...data, updatedAt: new Date()}).exec();
        } catch (err) {
            console.error('DatabaseService:Update', err);
            throw err;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            await User.findByIdAndRemove(id).exec();
        } catch (err) {
            console.error('DatabaseService:Delete', err);
            throw err;
        }
    }

    public async all(conditions: IUserFilterModel = {}): Promise<IUserModel[]> {
        try {
            let query = User.find();
            if (typeof conditions.deleted === 'boolean') {
                query = query.where('deleted', conditions.deleted);
            }
            if (conditions.deletedAt !== undefined) {
                query = compareFilter(query, 'deletedAt', conditions.deletedAt);
            }
            if (conditions.createdAt) {
                query = compareFilter(query, 'createdAt', conditions.createdAt);
            }
            if (conditions.updatedAt) {
                query = compareFilter(query, 'updatedAt', conditions.updatedAt);
            }
            if (conditions.lastLogin !== undefined) {
                query = compareFilter(query, 'lastLogin', conditions.lastLogin);
            }
            if (typeof conditions.active === 'boolean') {
                query = query.where('active', conditions.active);
            }
            if (conditions.gender !== undefined) {
                query = query.where('gender', conditions.gender);
            }
            if (conditions.birthday !== undefined) {
                query = compareFilter(query, 'birthday', conditions.birthday);
            }
            if (conditions.groups && conditions.groups.length > 0) {
                query = query.where('groups').in(conditions.groups);
            }
            if (conditions.role) {
                if (conditions.role.eq) {
                    query = query.where('role', conditions.role.eq);
                } else if (conditions.role.in) {
                    query = query.where('role').in(conditions.role.in);
                }
            }
            return await query.exec();
        } catch (err) {
            console.error('DatabaseService:All', err);
            throw err;
        }
    }

    public async findOne(conditions: object): Promise<IUserModel | null> {
        try {
            return await User.findOne(conditions).exec();
        } catch (err) {
            console.error('DatabaseService:FindOne', err);
            throw err;
        }
    }
}
