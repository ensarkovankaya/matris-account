import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { EmailAlreadyExists, UserNameExists, UserNotFound } from '../../errors';
import { DatabaseService } from '../../services/database.service';
import { PasswordArgs } from '../args/password.args';
import { UserArgs } from '../args/user.args';
import { UserFilterArgs } from '../args/user.filter.args';
import { CreateInput } from '../inputs/create.input';
import { UpdateInput } from '../inputs/update.input';
import { User } from '../schemas/user.schema';

@Service()
@Resolver(of => User)
export class UserResolver {
    constructor(private db: DatabaseService) {
    }

    @Query(returnType => [User], {description: 'Find user.'})
    public async find(@Args() args: UserFilterArgs) {
        return await this.db.find(args);
    }

    @Query(returnType => User, {nullable: true, description: 'Get user by id, email or username.'})
    public async get(@Args() {id, email, username}: UserArgs) {
        try {
            if (id) {
                return await this.db.findOne({_id: id});
            } else if (email) {
                return await this.db.findOne({email});
            } else if (username) {
                return await this.db.findOne({username});
            }
            return null;
        } catch (err) {
            console.error('UserResolver:User', err);
            throw err;
        }
    }

    @Query(returnType => Boolean, {description: 'Validate is user password is valid.'})
    public async isPasswordValid(@Args() {id, password}: PasswordArgs) {
        const user = await this.db.findOne({_id: id});
        if (!user) {
            throw new UserNotFound();
        }
        return this.db.isPasswordValid(password, user.get('password'));
    }

    @Mutation(returnType => User, {description: 'Create user.'})
    public async create(@Arg('data') data: CreateInput) {
        if (data.username) {
            // Check username exists
            const isUsernameExists = await this.db.isUserNameExists(data.username);
            if (isUsernameExists) {
                throw new UserNameExists();
            }
        } else {
            data.username = data.firstName + data.lastName;
        }

        // Check email exists
        const isEmailExists = await this.db.findOne({email: data.email});
        if (isEmailExists) {
            throw new EmailAlreadyExists();
        }
        try {
            return await this.db.create(data);
        } catch (err) {
            console.error('UserResolver:Create', err);
            throw err;
        }
    }

    @Mutation(returnType => User, {description: 'Update User'})
    public async update(@Arg('id') id: string, @Arg('data') data: UpdateInput) {
        // Check is user exists
        const user = await this.db.findOne({_id: id});
        if (!user) {
            throw new UserNotFound();
        }
        // If user email changed check is email already exists
        if (data.email && data.email !== user.email) {
            const isEmailExists = await this.db.findOne({email: data.email});
            if (isEmailExists) {
                throw new EmailAlreadyExists();
            }
        }
        // If user username changed check is username already exists
        if (data.username && data.username !== user.username) {
            const isUsernameExists = await this.db.findOne({username: data.username});
            if (isUsernameExists) {
                throw new UserNameExists();
            }
        }
        try {
            return await this.db.update(id, data);
        } catch (err) {
            console.error('UserResolver:Update', err);
            throw err;
        }
    }

    @Mutation(returnType => Boolean, {description: 'Delete user'})
    public async delete(@Arg('id') id: string) {
        // Check is user exists
        const user = await this.db.findOne({_id: id});
        if (!user) {
            throw new UserNotFound();
        }
        try {
            await this.db.delete(id);
            return true;
        } catch (err) {
            console.error('UserResolver:Delete', err);
            throw err;
        }
    }
}
