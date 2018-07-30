import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { UserResolver } from '../../../../src/graphql/resolvers/user.resolver';
import { Gender } from '../../../../src/models/gender.model';
import { Role } from '../../../../src/models/role.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

class MethodCalled extends Error {
    public name = 'MethodCalled';

    constructor(public methodName: string, public data?: any) {
        super();
    }
}

describe('Resolvers -> User', () => {
    describe('Create', () => {
        it('should call getBy method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    throw new MethodCalled('getBy', by);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({email: 'mail@mail.com'});
            }
        });

        it('should raise EmailAlreadyExists', async () => {
            class Service {

                public getBy(by: object) {
                    return true;
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                console.log(e);
                expect(e.name).to.be.eq('EmailAlreadyExists');
            }
        });

        it('should call normalizeUserName from UserService', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    throw new MethodCalled('normalizeUserName', data);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678',
                    username: 'username'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('normalizeUserName');
                expect(e.data).to.be.eq('username');
            }
        });

        it('should raise UserNameNotNormalized', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return 'somethingelse';
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678',
                    username: 'username'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNameNotNormalized');
            }
        });

        it('should call normalizeUserName from UserService if username given', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public isUsernameExists(data: any) {
                    throw new MethodCalled('isUsernameExists', data);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678',
                    username: 'username'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('isUsernameExists');
                expect(e.data).to.be.eq('username');
            }
        });

        it('should raise UserNameExists', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public isUsernameExists(data: any) {
                    return true;
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678',
                    username: 'username'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNameExists');
            }
        });

        it('should call generateUserName from UserService if username not given', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public generateUserName(data: any) {
                    throw new MethodCalled('generateUserName', data);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'First Name',
                    lastName: 'Last Name',
                    role: Role.ADMIN,
                    password: '12345678'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('generateUserName');
                expect(e.data).to.be.eq('First NameLast Name');
            }
        });

        it('should call create from UserService', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public isUsernameExists(data: any) {
                    return false;
                }

                public generateUserName(data: any) {
                    return 'username';
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public create(data: any) {
                    throw new MethodCalled('create', data);
                }
            }

            const service = new Service();

            // Should generate username
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    extra: 'key'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('create');
                expect(e.data).to.have.keys(
                    ['email', 'firstName', 'lastName', 'password', 'role', 'gender', 'active', 'groups', 'username']
                );
                expect(e.data).to.be.deep.eq({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    username: 'username'
                });
            }
        });

        it('should call create from UserService with adding custom username', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public isUsernameExists(data: any) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public generateUserName(data: any) {
                    return 'username';
                }

                public create(data: any) {
                    throw new MethodCalled('create', data);
                }
            }

            const service = new Service();

            // Should generate username
            try {
                const resolver = new UserResolver(service as any);

                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    username: 'customusername',
                    extra: 'key'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('create');
                expect(e.data).to.have.keys(
                    ['email', 'firstName', 'lastName', 'password', 'role', 'gender', 'active', 'groups', 'username']
                );
                expect(e.data).to.be.deep.eq({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    username: 'customusername'
                });
            }
        });

        it('should call create from UserService with adding birthday', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public isUsernameExists(data: any) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public generateUserName(data: any) {
                    return 'username';
                }

                public create(data: any) {
                    throw new MethodCalled('create', data);
                }
            }

            const service = new Service();

            // Should add birthday to create data
            const birthday = new Date(1993, 1, 1);
            try {
                const resolver = new UserResolver(service as any);
                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    birthday,
                    extra: 'key'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('create');
                expect(e.data).to.have.keys(['email', 'firstName', 'lastName', 'password', 'role',
                    'gender', 'active', 'groups', 'username', 'birthday']);
                expect(e.data).to.be.deep.eq({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    username: 'username',
                    birthday
                });
            }
        });

        it('should cast birthday to date', async () => {
            class Service {

                public getBy(by: object) {
                    return false;
                }

                public isUsernameExists(data: any) {
                    return false;
                }

                public normalizeUserName(data: any) {
                    return data;
                }

                public generateUserName(data: any) {
                    return 'username';
                }

                public create(data: any) {
                    throw new MethodCalled('create', data);
                }
            }

            const service = new Service();

            // Should add birthday to create data
            try {
                const resolver = new UserResolver(service as any);
                await resolver.create({
                    email: 'mail@mail.com',
                    firstName: 'firstName',
                    lastName: 'lastName',
                    password: '12345678',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    birthday: '10/01/1993',
                    extra: 'key'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('create');
                expect(e.data.birthday).to.be.a('date');
            }
        });
    });

    describe('Update', () => {
        it('should call getBy method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    throw new MethodCalled('getBy', by);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({id: '1'.repeat(24)});
            }
        });

        it('should raise UserNotFound', async () => {
            class Service {
                public getBy(by: object) {
                    return null;
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNotFound');
            }
        });

        it('should raise EmailAlreadyExists', async () => {
            class Service {
                public getBy(by: object) {
                    return {};
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {email: 'email@mail.com'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('EmailAlreadyExists');
            }
        });

        it('should call normalizeUserName method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    return {username: 'anotherusername'};
                }

                public normalizeUserName(data: any) {
                    throw new MethodCalled('normalizeUserName', data);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {username: 'user2'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('normalizeUserName');
                expect(e.data).to.be.eq('user2');
            }
        });

        it('should raise UserNameExists', async () => {
            class Service {
                public called = 0;

                public getBy(by: object) {
                    if (this.called === 0) {
                        this.called++;
                        return {username: 'username'};
                    }
                    return {};
                }

                public normalizeUserName(data) {
                    return 'user123';
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {username: 'user123'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNameExists');
            }
        });

        it('should call update method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    return {};
                }

                public update(id: string, data: any) {
                    throw new MethodCalled('update', {id, data});
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    password: 'password',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    updateLastLogin: true,
                    extra: 'key'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('update');
                expect(e.data.id).to.be.eq('1'.repeat(24));
                expect(e.data.data).to.be.an('object');
                expect(e.data.data).to.have.keys(
                    ['firstName', 'lastName', 'password', 'role', 'gender', 'active', 'groups', 'updateLastLogin']
                );
                expect(e.data.data).to.be.deep.eq({
                    firstName: 'FirstName',
                    lastName: 'LastName',
                    password: 'password',
                    role: Role.ADMIN,
                    gender: Gender.FEMALE,
                    active: true,
                    groups: [],
                    updateLastLogin: true
                });
            }
        });

        it('should transform birthday to Date object', async () => {
            class Service {
                public getBy(by: object) {
                    return {};
                }

                public update(id: string, data: any) {
                    throw new MethodCalled('update', {id, data});
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.update('1'.repeat(24), {birthday: '01/01/1993'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.data).to.be.an('object');
                expect(e.data.data).to.be.an('object');
                expect(e.data.data.birthday).to.be.a('date');
            }
        });
    });

    describe('Delete', () => {
        it('should call getBy method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    throw new MethodCalled('getBy', by);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.delete('1'.repeat(24));
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({id: '1'.repeat(24)});
            }
        });

        it('should raise UserNotFound', async () => {
            class Service {
                public getBy(by: object) {
                    return null;
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.delete('1'.repeat(24));
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNotFound');
            }
        });

        it('should call delete method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    return {};
                }

                public delete(id: string) {
                    throw new MethodCalled('delete', id);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.delete('1'.repeat(24));
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('delete');
                expect(e.data).to.be.eq('1'.repeat(24));
            }
        });
    });

    describe('Password', () => {
        it('should call getBy method from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    throw new MethodCalled('getBy', by);
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.password({email: 'mail@mail.com', password: '12345678'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({email: 'mail@mail.com'});
            }
        });

        it('should raise UserNotFound', async () => {
            class Service {
                public getBy(by: object) {
                    return null;
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.password({email: 'mail@mail.com', password: '12345678'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNotFound');
            }
        });

        it('should raise UserNotActive', async () => {
            class Service {
                public getBy(by: object) {
                    return {active: false};
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.password({email: 'mail@mail.com', password: '12345678'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNotActive');
            }
        });

        it('should call isPasswordValid from UserService', async () => {
            class Service {
                public getBy(by: object) {
                    return {active: true, password: 'asd'};
                }

                public isPasswordValid(password: string, hash: string) {
                    throw new MethodCalled('isPasswordValid', {password, hash});
                }
            }

            const service = new Service();
            try {
                const resolver = new UserResolver(service as any);

                await resolver.password({email: 'mail@mail.com', password: '12345678'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('isPasswordValid');
                expect(e.data).to.be.deep.eq({password: '12345678', hash: 'asd'});
            }
        });
    });

    describe('Get', () => {
        it('should raise ParameterRequired', async () => {
            try {
                const resolver = new UserResolver({} as any);

                await resolver.get({} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ParameterRequired');
            }
        });

        it('should call getBy from UserService with id', async () => {
            try {
                class Service {
                    public getBy(by: object) {
                        throw new MethodCalled('getBy', by);
                    }
                }

                const service = new Service();
                const resolver = new UserResolver(service as any);

                await resolver.get({id: '1'.repeat(24)} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({id: '1'.repeat(24)});
            }
        });

        it('should call getBy from UserService with email', async () => {
            try {
                class Service {
                    public getBy(by: object) {
                        throw new MethodCalled('getBy', by);
                    }
                }

                const service = new Service();
                const resolver = new UserResolver(service as any);

                await resolver.get({email: 'mail@mail.com'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({email: 'mail@mail.com'});
            }
        });

        it('should call getBy from UserService with username', async () => {
            try {
                class Service {
                    public getBy(by: object) {
                        throw new MethodCalled('getBy', by);
                    }
                }

                const service = new Service();
                const resolver = new UserResolver(service as any);

                await resolver.get({username: 'username'} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('getBy');
                expect(e.data).to.be.deep.eq({username: 'username'});
            }
        });
    });

    describe('Find', () => {
        it('should call all method from UserService', async () => {
            try {
                class Service {
                    public all(data: any) {
                        throw new MethodCalled('all', data);
                    }
                }

                const service = new Service();
                const resolver = new UserResolver(service as any);

                await resolver.find({} as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('MethodCalled');
                expect(e.methodName).to.be.eq('all');
                expect(e.data).to.be.deep.eq({});
            }
        });
    });
});
