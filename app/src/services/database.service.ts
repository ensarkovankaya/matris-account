import { DocumentQuery, PaginateOptions, PaginateResult } from 'mongoose';
import { Service } from 'typedi';
import { getLogger, Logger } from '../logger';
import { ICompareDateModel, ICompareNumberModel } from '../models/compare.model';
import { IDatabaseModel } from '../models/database.model';
import { IUserFilterModel } from '../models/user.filter.model';
import { IUserModel } from '../models/user.model';
import { User } from '../models/user.schema';

export const compareFilter =
    (query: DocumentQuery<any[], any>, path: string, filter: ICompareDateModel | ICompareNumberModel):
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

@Service('DatabaseService')
export class DatabaseService implements IDatabaseModel<IUserModel> {

    public logger: Logger;

    constructor() {
        this.logger = getLogger('DatabaseService', ['service']);
    }

    public async create(data: object): Promise<IUserModel> {
        this.logger.debug('Create', {data});
        try {
            return await new User({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            }).save({validateBeforeSave: true});
        } catch (err) {
            this.logger.error('Create', err);
            throw err;
        }
    }

    public async update(id: string, data: object): Promise<void> {
        this.logger.debug('Update', {id, data});
        try {
            await User.findByIdAndUpdate(id, {...data, updatedAt: new Date()}).exec();
        } catch (err) {
            this.logger.error('Update', err);
            throw err;
        }
    }

    public async delete(id: string): Promise<void> {
        this.logger.debug('Delete', {id});
        try {
            await User.findByIdAndRemove(id).exec();
        } catch (err) {
            this.logger.error('Delete', err);
            throw err;
        }
    }

    public async all(conditions: IUserFilterModel = {}, pagination: PaginateOptions):
        Promise<PaginateResult<IUserModel>> {
        this.logger.debug('All', {conditions});
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
            if (conditions.gender) {
                if (conditions.gender.eq) {
                    query = query.where('gender', conditions.gender.eq);
                } else if (conditions.gender.in) {
                    query = query.where('gender').in(conditions.gender.in);
                }
            }
            if (conditions.birthday !== undefined) {
                query = compareFilter(query, 'birthday', conditions.birthday);
            }

            if (conditions.role) {
                if (conditions.role.eq) {
                    query = query.where('role', conditions.role.eq);
                } else if (conditions.role.in) {
                    query = query.where('role').in(conditions.role.in);
                }
            }
            return await User.paginate(query.getQuery(), pagination);
        } catch (err) {
            this.logger.error('All', err);
            throw err;
        }
    }

    public async findOne(conditions: object): Promise<IUserModel | null> {
        this.logger.debug('FindOne', {conditions});
        try {
            return await User.findOne(conditions).exec();
        } catch (err) {
            this.logger.error('FindOne', err);
            throw err;
        }
    }
}
