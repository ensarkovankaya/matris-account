import * as bcrypt from 'bcrypt';
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

    public async create(data: ICreateUserModel) {
        try {
            // Generate random username if not exists
            const username = data.username || this.generateUsername(data.firstName + data.lastName);
            const exists = await this.isUserNameExists(username);
            if (exists) {
                return this.create({...data, username: null});
            }

            // Create User
            return await new User({
                ...data,
                password: this.hashPassword(data.password),
                username
            }).save({validateBeforeSave: true});
        } catch (err) {
            console.error('DatabaseService:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: IUpdateUserModel) {
        try {
            if (data.password) {
                data.password = this.hashPassword(data.password);
            }
            return await User.findByIdAndUpdate(id, {
                ...data,
                updatedAt: new Date()
            }).exec();
        } catch (err) {
            console.error('DatabaseService:Update', err);
            throw err;
        }
    }

    public async delete(id: string) {
        try {
            await User.findByIdAndUpdate(id, {
                deletedAt: new Date(),
                deleted: true
            }).exec();
        } catch (err) {
            console.error('DatabaseService:Update', err);
            throw err;
        }
    }

    public hashPassword(plain: string): string {
        try {
            return bcrypt.hashSync(plain, 10);
        } catch (err) {
            console.error('DatabaseService:HashPassword', err);
            throw err;
        }
    }

    public isPasswordValid(plain: string, hash: string): boolean {
        try {
            return bcrypt.compareSync(plain, hash);
        } catch (err) {
            console.error('DatabaseService:IsPasswordValid', err);
            throw err;
        }
    }

    public async find(conditions: IUserFilterModel = {}) {
        try {
            console.debug('DatabaseService:Find', {conditions});
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
            return await query.exec();
        } catch (err) {
            console.error('DatabaseService:Find', err);
            throw err;
        }
    }

    public async findOne(condition: { _id: string } | { email: string } | { username: string }, deleted = false) {
        try {
            return await User.findOne({...condition, deleted}).exec();
        } catch (err) {
            console.error('DatabaseService:FindOne', err);
            throw err;
        }
    }

    public generateUsername(initial?: string, maxLenght: number = 20): string {
        let username = initial || '';
        if (username.length >= maxLenght) {
            username = username.slice(0, maxLenght - 6) + Math.random().toString(36).substring(7);
        } else {
            username = username + Math.random().toString(36).substring(7);
        }
        return username.slice(0, maxLenght)
            .normalize()
            .toLocaleLowerCase()
            .replace('ğ', 'g')
            .replace('ü', 'u')
            .replace('ç', 'c')
            .replace('ş', 's')
            .replace('ı', 'i')
            .replace('ö', 'o');
    }

    public async isUserNameExists(username: string): Promise<boolean> {
        try {
            return await User.findOne({username}).exec() !== null;
        } catch (err) {
            console.error('DatabaseService:IsUserNameExists', err);
            throw err;
        }
    }
}
