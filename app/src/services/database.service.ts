import { DocumentQuery } from 'mongoose';
import { Service } from 'typedi';
import { ICompareModel } from '../models/compare.model';
import { ICreateUserModel, IUpdateUserModel, IUserFilterModel, IUserModel } from '../models/user.model';
import { User } from '../models/user.schema';

export const compareFilter = (query: DocumentQuery<IUserModel[], IUserModel>, path: string, filter: ICompareModel):
    DocumentQuery<IUserModel[], IUserModel> => {
    if (typeof filter.eq === 'number' || filter.eq) {
        return query.where(path, filter.eq);
    }
    if (typeof filter.gt === 'number' || filter.gt) {
        query = query.where(path).gt(filter.gt as number);
    } else if (typeof filter.gte === 'number' || filter.gte) {
        query = query.where(path).gte(filter.gte as number);
    }
    if (typeof filter.lt === 'number' || filter.lt) {
        query = query.where(path).lt(filter.lt as number);
    } else if (typeof filter.lte === 'number' || filter.lte) {
        query = query.where(path).lte(filter.lte as number);
    }
    return query;
};

@Service()
export class DatabaseService {

    public async create(data: object) {
        try {
            return await new User(data).save({validateBeforeSave: true});
        } catch (err) {
            console.error('DatabaseService:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: object) {
        try {
            return await User.findByIdAndUpdate(id, data).exec();
        } catch (err) {
            console.error('DatabaseService:Update', err);
            throw err;
        }
    }

    public async delete(id: string) {
        try {
            await User.findOneAndRemove({_id: id}).exec();
        } catch (err) {
            console.error('DatabaseService:Delete', err);
            throw err;
        }
    }

    public async all(conditions: IUserFilterModel = {}) {
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

    public async findOne(conditions?: object) {
        try {
            return await User.findOne(conditions).exec();
        } catch (err) {
            console.error('DatabaseService:FindOne', err);
            throw err;
        }
    }
}
