import * as bcrypt from 'bcrypt';
import { PaginateOptions, PaginateResult, Types } from 'mongoose';
import { Service } from 'typedi';
import { EmailRequired,
    FirstNameRequired,
    InvalidID,
    LastNameRequired,
    NothingToUpdate,
    ParameterRequired,
    PasswordRequired,
    RoleRequired,
    UserNameRequired} from '../errors';
import { getLogger, Logger } from '../logger';
import { ICreateUserModel } from '../models/create.user.model';
import { IUpdateUserModel } from '../models/update.user.model';
import { IUserFilterModel } from '../models/user.filter.model';
import { IUserModel } from '../models/user.model';
import { DatabaseService } from './database.service';

@Service('UserService')
export class UserService {

    private logger: Logger;

    constructor(public db: DatabaseService) {
        this.logger = getLogger('UserService', ['service']);
    }

    public async create(data: ICreateUserModel): Promise<IUserModel> {
        this.logger.debug('Create', data);
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
        if (!data.username) {
            throw new UserNameRequired();
        }
        try {
            // Hash the password
            const password = await this.hashPassword(data.password);
            // Generate random username if not exists

            let create: object = {
                password,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                role: data.role,
                email: data.email,
                active: data.active !== false,
                birthday: data.birthday ? new Date(data.birthday) : null
            };

            if (data.gender) {
                create = {...create, gender: data.gender};
            }

            // Create User
            return await this.db.create({...create});
        } catch (err) {
            this.logger.error('Create', err);
            throw err;
        }
    }

    public async update(id: string, data: IUpdateUserModel): Promise<IUserModel> {
        this.logger.debug('Update', {id, data});
        try {
            let update = {};  // Build update object

            if (data.password) {
                update = {...update, password: await this.hashPassword(data.password)};
            }

            if (typeof data.active === 'boolean') {
                update = {...update, active: data.active};
            }

            if (data.birthday === null || data.birthday) {
                update = {...update, birthday: data.birthday ? new Date(data.birthday) : null};
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

            if (data.gender) {
                update = {...update, gender: data.gender};
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

            if (Object.keys(update).length === 0) {
                throw new NothingToUpdate();
            }

            // Update user
            await this.db.update(id, {...update, updatedAt: new Date()});

            // Return updated user
            return await this.db.findOne({_id: id});
        } catch (err) {
            this.logger.error('Update', err);
            throw err;
        }
    }

    public async delete(id: string, hard: boolean = false): Promise<void> {
        this.logger.debug('Delete', {id, hard});
        try {
            if (hard) {
                await this.db.delete(id);
            } else {
                await this.db.update(id, {deleted: true, deletedAt: new Date()});
            }
        } catch (err) {
            this.logger.error('Delete', err);
            throw err;
        }
    }

    public async all(filters: IUserFilterModel, pagination: PaginateOptions): Promise<PaginateResult<IUserModel>> {
        this.logger.debug('All', {filters});
        try {
            return await this.db.all(filters, pagination);
        } catch (err) {
            this.logger.error('All', err);
            throw err;
        }
    }

    public async getBy(by: { id?: string, email?: string, username?: string }, deleted: boolean | null = false) {
        this.logger.debug('GetBy', {by, deleted});
        if (!by.id && !by.email && !by.username) {
            throw new ParameterRequired();
        }
        let user: IUserModel | null = null;
        try {
            let condition: object = {};
            if (typeof deleted === 'boolean') {
                condition = {deleted};
            }
            if (by.id) {
                // If given id is not valid return null
                if (!Types.ObjectId.isValid(by.id)) {
                    throw new InvalidID();
                }
                user = await this.db.findOne({...condition, _id: by.id});
            } else if (by.email) {
                user = await this.db.findOne({...condition, email: by.email});
            } else if (by.username) {
                user = await this.db.findOne({...condition, username: by.username});
            }
            this.logger.debug('User get from database.', {user});
            return user;
        } catch (err) {
            this.logger.error('GetBy', err);
            throw err;
        }
    }

    public async isUsernameExists(username: string): Promise<boolean> {
        this.logger.debug('IsUsernameExists', {username});
        try {
            return await this.db.findOne({username: this.normalizeUserName(username)}) !== null;
        } catch (err) {
            this.logger.error('IsUsernameExists', err);
            throw err;
        }
    }

    public async isPasswordValid(plain: string, hash: string): Promise<boolean> {
        this.logger.debug('IsPasswordValid', {plain, hash});
        try {
            return await bcrypt.compare(plain, hash);
        } catch (err) {
            this.logger.error('IsPasswordValid', err);
            throw err;
        }
    }

    public async hashPassword(plain: string): Promise<string> {
        try {
            return await bcrypt.hash(String(plain), 10);
        } catch (err) {
            this.logger.error('HashPassword', err);
            throw err;
        }
    }

    public normalizeUserName(username: string) {
        try {
            this.logger.debug('NormalizeUsername', {unNormalized: username});
            // Lowercase
            username = username.trim().normalize().toLowerCase();

            // Replace Turkish characters
            username = username
                .replace(new RegExp('ğ', 'g'), 'g')
                .replace(new RegExp('Ğ', 'g'), 'g')
                .replace(new RegExp('ü', 'g'), 'u')
                .replace(new RegExp('Ü', 'g'), 'u')
                .replace(new RegExp('ç', 'g'), 'c')
                .replace(new RegExp('Ç', 'g'), 'c')
                .replace(new RegExp('ş', 'g'), 's')
                .replace(new RegExp('Ş', 'g'), 's')
                .replace(new RegExp('ı', 'g'), 'i')
                .replace(new RegExp('I', 'g'), 'i')
                .replace(new RegExp('ö', 'g'), 'o')
                .replace(new RegExp('Ö', 'g'), 'o');

            // Remove non alphanumeric characters
            username = username.replace(/[^a-zA-Z0-9]/g, '');

            this.logger.debug('NormalizeUsername', {normalized: username});
            return username;
        } catch (e) {
            this.logger.error('NormalizeUsername', e);
            throw e;
        }
    }

    /**
     * Generates username.
     * @param {string} initial: Initial username if given it will add random 4 digit number
     * @param {number} maxLength: Maximum length of username can be
     * @return {string}
     */
    public generateUserName(initial: string = 'user', maxLength: number = 20): string {
        try {
            this.logger.debug('GenerateUserName', {initial});

            let random = '';
            // Generate 4 random digit
            for (let i = 0; i < 4; i++) {
                random += String(Math.floor(Math.random() * 10));
            }

            const username = this.normalizeUserName(initial) + random; // user1362
            if (username.length > maxLength) {
                return this.normalizeUserName(username.substring(0, maxLength));
            }
            return this.normalizeUserName(username);
        } catch (e) {
            this.logger.error('GenerateUserName', e);
            throw e;
        }
    }
}
