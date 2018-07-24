import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getLogger, Logger } from '../../logger';
import { ICreateUserModel, IUpdateUserModel } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserArgs } from '../args/user.args';
import { CreateInput } from '../inputs/create.input';
import { IDInput } from '../inputs/id.Input';
import { PaginationInput } from '../inputs/pagination.input';
import { PasswordInput } from '../inputs/password.input';
import { UpdateInput } from '../inputs/update.input';
import { UserFilterInput } from '../inputs/user.filter.input';
import { ListResultSchema } from '../schemas/list.result.schema';
import { User } from '../schemas/user.schema';
import {
    EmailAlreadyExists,
    ParameterRequired,
    UserNameExists,
    UserNameNotNormalized, UserNotActive,
    UserNotFound
} from './user.resolver.errors';

@Service('UserResolver')
@Resolver(of => User)
export class UserResolver {

    private logger: Logger;

    constructor(private us: UserService) {
        this.logger = getLogger('UserResolver', ['resolver']);
    }

    @Query(returnType => ListResultSchema, {description: 'Find user.'})
    public async find(@Arg('filters') filters: UserFilterInput,
                      @Arg('pagination', {nullable: true}) pagination: PaginationInput = new PaginationInput()) {
        await new UserFilterInput(filters).validate();
        await new PaginationInput(pagination).validate();
        this.logger.debug('Find', {filters, pagination});
        return await this.us.all(filters, pagination);
    }

    @Query(returnType => User, {nullable: true, description: 'Get user by id, email or username.'})
    public async get(@Args() by: UserArgs) {
        this.logger.debug('Get', {by});
        await new UserArgs(by).validate();
        if (!by.id && !by.email && !by.username) {
            throw new ParameterRequired('id, email or username');
        }
        try {
            if (by.id) {
                return await this.us.getBy({id: by.id});
            } else if (by.email) {
                return await this.us.getBy({email: by.email});
            } else {
                return await this.us.getBy({username: by.username});
            }
        } catch (err) {
            this.logger.error('Get', err);
            throw err;
        }
    }

    @Query(returnType => Boolean, {description: 'Validate is user password is valid.'})
    public async password(@Arg('data') data: PasswordInput) {
        this.logger.debug('Password', {data});
        await new PasswordInput(data).validate();
        let user;
        try {
            user = await this.us.getBy({email: data.email});
            this.logger.debug('Password', {user});
        } catch (e) {
            this.logger.error('Password', e);
            throw e;
        }
        if (!user) {
            throw new UserNotFound({email: data.email});
        }
        if (!user.active) {
            throw new UserNotActive({email: data.email});
        }
        try {
            return await this.us.isPasswordValid(data.password, user.password);
        } catch (e) {
            this.logger.error('Password', e);
            throw e;
        }
    }

    @Mutation(returnType => User, {description: 'Create user.'})
    public async create(@Arg('data') data: CreateInput) {
        this.logger.debug('Create', {data});
        await new CreateInput(data).validate();
        // Check email exists
        const isEmailExists = await this.us.getBy({email: data.email});
        this.logger.debug('Create', {isEmailExists});
        if (isEmailExists) {
            throw new EmailAlreadyExists(data.email);
        }
        const createData: ICreateUserModel = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password,
            role: data.role,
            gender: data.gender,
            active: data.active,
            groups: data.groups
        };
        if (data.username) {
            if (this.us.normalizeUserName(data.username) !== data.username) {
                throw new UserNameNotNormalized();
            }
            // Check username exists
            const isUsernameExists = await this.us.isUsernameExists(data.username);
            this.logger.debug('Create', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists(data.username);
            }
            createData.username = data.username;
        } else {
            createData.username = this.us.generateUserName(data.firstName + data.lastName);
            this.logger.debug('Create', {generatedUsername: data.username});
        }

        // Transform birthday from string to Date object
        if (data.birthday) {
            createData.birthday = new Date(data.birthday);
        }
        try {
            return await this.us.create(createData);
        } catch (err) {
            this.logger.error('Create', err);
            throw err;
        }
    }

    @Mutation(returnType => User, {description: 'Update User'})
    public async update(@Arg('id') id: string, @Arg('data') data: UpdateInput) {
        this.logger.debug('Update', {id, data});
        await new UpdateInput(data).validate();
        // Check is user exists
        const user = await this.us.getBy({id});
        this.logger.debug('Update', {user});
        if (!user) {
            throw new UserNotFound({id});
        }
        // Create update object
        const updateData: IUpdateUserModel = {};

        // If user email changed check is email already exists
        if (data.email && data.email !== user.email) {
            const isEmailExists = await this.us.getBy({email: data.email});
            this.logger.debug('Update', {isEmailExists});
            if (isEmailExists) {
                throw new EmailAlreadyExists();
            }
            updateData.email = data.email;
        }
        // If user username changed check is username already exists
        if (data.username && data.username !== user.username) {
            if (this.us.normalizeUserName(data.username) !== data.username) {
                throw new UserNameNotNormalized();
            }
            const isUsernameExists = await this.us.getBy({username: data.username}, null);
            this.logger.debug('Update', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists(data.username);
            }
            updateData.username = data.username;
        }
        // Transform birthday from string to Date object
        if (data.birthday) {
            updateData.birthday = new Date(data.birthday);
        }

        // Add other fields to update object
        if (data.firstName && data.firstName !== user.firstName) {
            updateData.firstName = data.firstName;
        }
        if (data.lastName && data.lastName !== user.lastName) {
            updateData.lastName = data.lastName;
        }
        if (data.password) {
            updateData.password = data.password;
        }
        if (data.role && data.role !== user.role) {
            updateData.role = data.role;
        }
        if (data.gender && data.gender !== user.gender) {
            updateData.gender = data.gender;
        }
        if (typeof data.active === 'boolean' && data.active !== user.active) {
            updateData.active = data.active;
        }
        if (data.groups) {
            updateData.groups = data.groups;
        }
        if (data.updateLastLogin) {
            updateData.updateLastLogin = true;
        }
        try {
            return await this.us.update(id, updateData);
        } catch (err) {
            this.logger.error('Update', err);
            throw err;
        }
    }

    @Mutation(returnType => Boolean, {description: 'Delete user'})
    public async delete(@Arg('data') data: IDInput) {
        this.logger.debug('Delete', {data});
        await new IDInput(data).validate();
        // Check is user exists
        const user = await this.us.getBy({id: data.id});
        this.logger.debug('Delete', {user});
        if (!user) {
            throw new UserNotFound({id: data.id});
        }
        try {
            await this.us.delete(data.id);
            return true;
        } catch (err) {
            this.logger.error('Delete', err);
            throw err;
        }
    }
}
