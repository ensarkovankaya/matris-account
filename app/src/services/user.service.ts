import * as bcrypt from 'bcrypt';
import { ICreateUserModel, IUpdateUserModel, IUserFilterModel } from '../models/user.model';
import { generateRandomUsername, normalizeUsername } from '../utils';
import { DatabaseService } from './database.service';

export class UserService {

    private static hashPassword(plain: string): string {
        try {
            return bcrypt.hashSync(plain, 10);
        } catch (err) {
            console.error('UserService:HashPassword', err);
            throw err;
        }
    }

    constructor(private db: DatabaseService) {
    }

    public async create(data: ICreateUserModel) {
        try {
            // Generate random username if not exists
            const username = normalizeUsername(data.username || generateRandomUsername(7)).slice(0, 15);
            const exists = await this.isUsernameExists(username);
            if (exists) {
                return this.create({...data, username: null});
            }

            // Create User
            return await this.db.create({
                ...data,
                password: UserService.hashPassword(data.password),
                username,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (err) {
            console.error('UserService:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: IUpdateUserModel) {
        try {
            if (data.password) {
                // Hash password
                data.password = UserService.hashPassword(data.password);
            }
            // Update user
            await this.db.update(id, {...data, updatedAt: new Date()});

            // Return updated user
            return await this.getBy(id);
        } catch (err) {
            console.error('UserService:Update', err);
            throw err;
        }
    }

    public async delete(id: string, hard: boolean = false) {
        try {
            if (hard) {
                return await this.db.delete(id);
            }
            return await this.db.update(id, {deleted: true, deletedAt: new Date()});
        } catch (err) {
            console.error('UserService:Delete', err);
            throw err;
        }
    }

    public async all(filters: IUserFilterModel = {}) {
        try {
            return await this.db.all(filters);
        } catch (err) {
            console.error('UserService:All', err);
            throw err;
        }
    }

    public async getBy(id?: string, email?: string, username?: string, deleted: boolean | null = false) {
        try {
            let condition: object = {};
            if (typeof deleted === 'boolean') {
                condition = {deleted};
            }
            if (id) {
                return await this.db.findOne({...condition, _id: id});
            } else if (email) {
                return await this.db.findOne({...condition, email});
            } else if (username) {
                return await this.db.findOne({...condition, username});
            }
            throw new Error('Parameter id, email or username required');
        } catch (err) {
            console.error('UserService:Get', err);
            throw err;
        }
    }

    public async isUsernameExists(username: string): Promise<boolean> {
        try {
            return await this.db.findOne({username}) !== null;
        } catch (err) {
            console.error('UserService:IsUsernameExists', err);
            throw err;
        }
    }

    public isPasswordValid(plain: string, hash: string): boolean {
        try {
            return bcrypt.compareSync(plain, hash);
        } catch (err) {
            console.error('UserService:IsPasswordValid', err);
            throw err;
        }
    }

}
