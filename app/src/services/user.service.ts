import * as bcrypt from 'bcrypt';
import { Service } from 'typedi';
import { ICreateUserModel, IUpdateUserModel, IUserFilterModel, IUserModel } from '../models/user.model';
import { generateRandomUsername, normalizeUsername } from '../utils';
import { DatabaseService } from './database.service';

class PasswordRequired extends Error {
    public name = 'PasswordRequired';
    public message = 'User must have valid password.';
}

class RoleRequired extends Error {
    public name = 'RoleRequired';
    public message = 'User must have valid role.';
}

class EmailRequired extends Error {
    public name = 'EmailRequired';
    public message = 'User must have valid email address.';
}

class FirstNameRequired extends Error {
    public name = 'FirstNameRequired';
    public message = 'User must have valid first name.';
}

class LastNameRequired extends Error {
    public name = 'LastNameRequired';
    public message = 'User must have valid last name.';
}

@Service()
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

    public async create(data: ICreateUserModel): Promise<IUserModel> {
        if (!data.password) {
            throw new PasswordRequired();
        }
        if (!data.role) {
            throw new RoleRequired();
        }
        if (!data.email) {
            throw new EmailRequired();
        }
        if (!data.firstName) {
            throw new FirstNameRequired();
        }
        if (!data.lastName) {
            throw new LastNameRequired();
        }
        try {
            // Hash the password
            const password = UserService.hashPassword(data.password);
            // Generate random username if not exists
            const username = normalizeUsername(data.username || generateRandomUsername(7)).slice(0, 20);

            let create: object = {
                username,
                password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role,
                email: data.email,
                active: data.active !== false
            };

            if (data.gender !== undefined) {
                create = {...create, gender: data.gender};
            }

            if (data.birthday === null || data.birthday instanceof Date) {
                create = {...create, birthday: data.birthday};
            }

            if (data.groups && data.groups instanceof Array) {
                create = {...create, groups: data.groups};
            }
            // Create User
            return await this.db.create({...create});
        } catch (err) {
            console.error('UserService:Create', err);
            throw err;
        }
    }

    public async update(id: string, data: IUpdateUserModel): Promise<IUserModel> {
        try {
            let update = {};  // Build update object

            if (data.password) {
                update = {...update, password: UserService.hashPassword(data.password)};
            }

            if (typeof data.active === 'boolean') {
                update = {...update, active: data.active};
            }

            if (data.birthday === null || data.birthday instanceof Date) {
                update = {...update, birthday: data.birthday};
            }

            if (data.email) {
                update = {...update, email: data.email};
            }

            if (data.firstName) {
                update = {...update, firstName: data.firstName};
            }

            if (data.lastName) {
                update = {...update, lastName: data.lastName};
            }

            if (data.gender !== undefined) {
                update = {...update, gender: data.gender};
            }

            if (data.groups) {
                update = {...update, groups: data.groups};
            }

            if (data.role) {
                update = {...update, role: data.role};
            }

            if (data.username) {
                update = {...update, username: data.username};
            }

            if (data.updateLastLogin) {
                update = {...update, lastLogin: new Date()};
            }

            // Update user
            await this.db.update(id, {...update, updatedAt: new Date()});

            // Return updated user
            return await this.getBy({id});
        } catch (err) {
            console.error('UserService:Update', err);
            throw err;
        }
    }

    public async delete(id: string, hard: boolean = false): Promise<void> {
        try {
            if (hard) {
                return await this.db.delete(id);
            }
            await this.db.update(id, {deleted: true, deletedAt: new Date()});
        } catch (err) {
            console.error('UserService:Delete', err);
            throw err;
        }
    }

    public async all(filters: IUserFilterModel = {}): Promise<IUserModel[]> {
        try {
            return await this.db.all(filters);
        } catch (err) {
            console.error('UserService:All', err);
            throw err;
        }
    }

    public async getBy(by: { id?: string, email?: string, username?: string }, deleted: boolean | null = false) {
        if (!by.id && !by.email && !by.username) {
            throw new Error('One of parameter id, email or username required');
        }
        try {
            let condition: object = {};
            if (typeof deleted === 'boolean') {
                condition = {deleted};
            }
            if (by.id) {
                return await this.db.findOne({...condition, _id: by.id});
            } else if (by.email) {
                return await this.db.findOne({...condition, email: by.email});
            }
            return await this.db.findOne({...condition, username: by.username});
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
