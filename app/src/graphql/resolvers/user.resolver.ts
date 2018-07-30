import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import {
    EmailAlreadyExists,
    ParameterRequired,
    UserNameExists,
    UserNameNotNormalized,
    UserNotActive,
    UserNotFound
} from '../../errors';
import { getLogger, Logger } from '../../logger';
import { ICreateUserModel } from '../../models/create.user.model';
import { IUpdateUserModel } from '../../models/update.user.model';
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
            throw new ParameterRequired();
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
            throw new UserNotFound();
        }
        if (!user.active) {
            throw new UserNotActive();
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
        const validatedData = await new CreateInput(data).validate();
        // Check email exists
        const isEmailExists = await this.us.getBy({email: validatedData.email});
        this.logger.debug('Create', {isEmailExists});
        if (isEmailExists) {
            throw new EmailAlreadyExists();
        }
        const createData: ICreateUserModel = {
            ...validatedData,
            firstName: validatedData.firstName || '',
            lastName: validatedData.lastName || '',
        };
        if (createData.username) {
            if (this.us.normalizeUserName(createData.username) !== createData.username) {
                throw new UserNameNotNormalized();
            }
            // Check username exists
            const isUsernameExists = await this.us.isUsernameExists(createData.username);
            this.logger.debug('Create', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists();
            }
        } else {
            const initial = ((validatedData.firstName || '') + (validatedData.lastName || '')) || 'user';
            createData.username = this.us.generateUserName(initial);
            this.logger.debug('Create', {generatedUsername: validatedData.username});
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
        await new IDInput(id).validate();
        const validatedData = await new UpdateInput(data).validate();
        // Check is user exists
        const user = await this.us.getBy({id});
        this.logger.debug('Update', {user});
        if (!user) {
            throw new UserNotFound();
        }
        // Create update object
        const updateData: IUpdateUserModel = {};

        // If user email changed check is email already exists
        if (validatedData.email && validatedData.email !== user.email) {
            const isEmailExists = await this.us.getBy({email: validatedData.email});
            this.logger.debug('Update', {isEmailExists});
            if (isEmailExists) {
                throw new EmailAlreadyExists();
            }
            updateData.email = validatedData.email;
        }
        // If user username changed check is username already exists
        if (validatedData.username && validatedData.username !== user.username) {
            if (this.us.normalizeUserName(validatedData.username) !== validatedData.username) {
                throw new UserNameNotNormalized();
            }
            const isUsernameExists = await this.us.getBy({username: validatedData.username}, null);
            this.logger.debug('Update', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists();
            }
            updateData.username = validatedData.username;
        }
        // Transform birthday from string to Date object
        if (validatedData.birthday) {
            updateData.birthday = new Date(validatedData.birthday);
        } else if (validatedData.birthday === null) {
            updateData.birthday = null;
        }

        // Add other fields to update object
        if (validatedData.firstName && validatedData.firstName !== user.firstName) {
            updateData.firstName = validatedData.firstName;
        }
        if (validatedData.lastName && validatedData.lastName !== user.lastName) {
            updateData.lastName = validatedData.lastName;
        }
        if (validatedData.password) {
            updateData.password = validatedData.password;
        }
        if (validatedData.role && validatedData.role !== user.role) {
            updateData.role = validatedData.role;
        }
        if (validatedData.gender && validatedData.gender !== user.gender) {
            updateData.gender = validatedData.gender;
        }
        if (typeof validatedData.active === 'boolean' && validatedData.active !== user.active) {
            updateData.active = validatedData.active;
        }
        if (validatedData.groups) {
            updateData.groups = validatedData.groups;
        }
        if (validatedData.updateLastLogin) {
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
    public async delete(@Arg('id') id: string) {
        this.logger.debug('Delete', {id});
        await new IDInput(id).validate();
        // Check is user exists
        const user = await this.us.getBy({id});
        this.logger.debug('Delete', {user});
        if (!user) {
            throw new UserNotFound();
        }
        try {
            await this.us.delete(id);
            return true;
        } catch (err) {
            this.logger.error('Delete', err);
            throw err;
        }
    }
}
