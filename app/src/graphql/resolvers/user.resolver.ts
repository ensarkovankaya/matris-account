import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { getLogger, Logger } from '../../logger';
import { UserService } from '../../services/user.service';
import { normalizeUsername } from '../../utils';
import { PasswordArgs } from '../args/password.args';
import { UserArgs } from '../args/user.args';
import { UserFilterArgs } from '../args/user.filter.args';
import { CreateInput } from '../inputs/create.input';
import { UpdateInput } from '../inputs/update.input';
import { User } from '../schemas/user.schema';
import { EmailAlreadyExists, ParameterRequired, UserNameExists, UserNotFound } from './user.resolver.errors';

@Service('UserResolver')
@Resolver(of => User)
export class UserResolver {

    private logger: Logger;

    constructor(private us: UserService) {
        this.logger = getLogger('UserResolver', ['resolver']);
    }

    @Query(returnType => [User], {description: 'Find user.'})
    public async find(@Args() args: UserFilterArgs) {
        this.logger.debug('Find', {args});
        return await this.us.all(args);
    }

    @Query(returnType => User, {nullable: true, description: 'Get user by id, email or username.'})
    public async get(@Args() by: UserArgs) {
        this.logger.debug('Get', {by});
        if (!by.id && !by.email && !by.username) {
            throw new ParameterRequired('id, email or username');
        }
        try {
            return await this.us.getBy(by);
        } catch (err) {
            this.logger.error('Get', err);
            throw err;
        }
    }

    @Query(returnType => Boolean, {description: 'Validate is user password is valid.'})
    public async password(@Args() {email, password}: PasswordArgs) {
        this.logger.debug('Get', {email, password});
        const user = await this.us.getBy({email});
        this.logger.debug('Get', {user});
        if (!user || !user.active) {
            throw new UserNotFound({email});
        }
        return this.us.isPasswordValid(password, user.password);
    }

    @Mutation(returnType => User, {description: 'Create user.'})
    public async create(@Arg('data') data: CreateInput) {
        this.logger.debug('Create', {data});
        if (data.username) {
            // Check username exists
            const isUsernameExists = await this.us.isUsernameExists(data.username);
            this.logger.debug('Create', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists(data.username);
            }
        } else {
            data.username = normalizeUsername(data.firstName + data.lastName).slice(0, 20);
            this.logger.debug('Create', {generatedUsername: data.username});
        }

        // Transform birthday from string to Date object
        if (typeof data.birthday === 'string' || data.birthday instanceof Date) {
            data.birthday = new Date(data.birthday);
        }
        // Check email exists
        const isEmailExists = await this.us.getBy({email: data.email});
        this.logger.debug('Create', {isEmailExists});
        if (isEmailExists) {
            throw new EmailAlreadyExists(data.email);
        }
        try {
            return await this.us.create(data);
        } catch (err) {
            this.logger.error('Create', err);
            throw err;
        }
    }

    @Mutation(returnType => User, {description: 'Update User'})
    public async update(@Arg('id') id: string, @Arg('data') data: UpdateInput) {
        this.logger.debug('Update', {id, data});
        // Check is user exists
        const user = await this.us.getBy({id});
        this.logger.debug('Update', {user});
        if (!user) {
            throw new UserNotFound({id});
        }
        // Transform birthday from string to Date object
        if (data.birthday) {
            data.birthday = new Date(data.birthday);
        }
        // If user email changed check is email already exists
        if (data.email && data.email !== user.email) {
            const isEmailExists = await this.us.getBy({email: data.email});
            this.logger.debug('Update', {isEmailExists});
            if (isEmailExists) {
                throw new EmailAlreadyExists();
            }
        }
        // If user username changed check is username already exists
        if (data.username && data.username !== user.username) {
            const isUsernameExists = await this.us.getBy({username: data.username}, null);
            this.logger.debug('Update', {isUsernameExists});
            if (isUsernameExists) {
                throw new UserNameExists(data.username);
            }
        }
        try {
            return await this.us.update(id, data);
        } catch (err) {
            this.logger.error('Update', err);
            throw err;
        }
    }

    @Mutation(returnType => Boolean, {description: 'Delete user'})
    public async delete(@Arg('id') id: string) {
        this.logger.debug('Delete', {id});
        // Check is user exists
        const user = await this.us.getBy({id});
        this.logger.debug('Delete', {user});
        if (!user) {
            throw new UserNotFound({id});
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
