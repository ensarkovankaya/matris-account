import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Gender, IUserModel, Role } from '../../../src/models/user.model';
import { NothingToUpdate, UserService } from '../../../src/services/user.service';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('Services -> User', () => {
    describe('Create', () => {
        it('should raise PasswordRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    role: Role.MANAGER,
                    email: 'email@mail.com',
                    firstName: 'FirstName',
                    lastName: 'LastName'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('PasswordRequired');
            }
        });
        it('should raise RoleRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    password: '12345678',
                    email: 'email@mail.com',
                    firstName: 'FirstName',
                    lastName: 'LastName'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('RoleRequired');
            }
        });
        it('should raise EmailRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    role: Role.MANAGER,
                    password: '12345678',
                    firstName: 'FirstName',
                    lastName: 'LastName'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('EmailRequired');
            }
        });
        it('should raise FirstNameRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    role: Role.MANAGER,
                    password: '12345678',
                    email: 'email@mail.com',
                    lastName: 'LastName'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('FirstNameRequired');
            }
        });
        it('should raise LastNameRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    role: Role.MANAGER,
                    password: '12345678',
                    email: 'email@mail.com',
                    firstName: 'FirstName',
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('LastNameRequired');
            }
        });

        it('should call database create with minimum data', async () => {
            class Database {
                public data: Partial<IUserModel>;

                public create(params: any) {
                    this.data = params;
                    return 'a';
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.create({
                email: 'email@mail.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: Role.STUDENT,
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.data).to.be.an('object');

            expect(db.data).to.have.keys(['username', 'password', 'email', 'firstName', 'lastName', 'role', 'active']);

            expect(db.data.username).to.be.a('string');
            expect(db.data.role).to.be.eq('STUDENT');

            expect(db.data.password).to.be.a('string');
            expect(db.data.password).to.be.not.eq('12345678');
            expect(db.data.password.length).to.be.gte(50);

            expect(db.data.email).to.be.eq('email@mail.com');
            expect(db.data.firstName).to.be.eq('FirstName');
            expect(db.data.lastName).to.be.eq('LastName');
            expect(db.data.active).to.be.eq(true);
        });

        it('should call database create with all data', async () => {
            class Database {
                public data: Partial<IUserModel>;

                public create(params: any) {
                    this.data = params;
                    return 'a';
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.create({
                email: 'email@mail.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                password: '12345678',
                role: Role.STUDENT,
                gender: Gender.MALE,
                birthday: '06/21/1956',
                groups: ['groupID'],
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.data).to.be.an('object');

            expect(db.data).to.have.keys(['username', 'email', 'password', 'firstName',
                'lastName', 'role', 'active', 'birthday', 'gender', 'groups']);

            expect(db.data.username).to.be.a('string');
            expect(db.data.role).to.be.eq('STUDENT');

            expect(db.data.password).to.be.a('string');
            expect(db.data.password).to.be.not.eq('12345678');
            expect(db.data.password.length).to.be.gte(50);

            expect(db.data.email).to.be.eq('email@mail.com');
            expect(db.data.firstName).to.be.eq('FirstName');
            expect(db.data.lastName).to.be.eq('LastName');
            expect(db.data.active).to.be.eq(true);

            expect(db.data.gender).to.be.eq('MALE');
            expect(db.data.birthday).to.be.a('date');

            expect(db.data.groups).to.be.an('array');
            expect(db.data.groups).to.have.lengthOf(1);
        });
    });

    describe('Update', () => {

        it('should raise NothingToUpdate', async () => {
            try {
                const service = new UserService({} as any);
                await service.update('id', {});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('NothingToUpdate');
            }
        });

        it('should call database update method', async () => {
            class Database {
                public data: Partial<IUserModel>;
                public id: string;
                public condition: object;

                public update(id: string, data: any) {
                    this.id = id;
                    this.data = data;
                }

                public findOne(condition: object) {
                    this.condition = condition;
                    return 'a';
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.update('id', {
                email: 'new@mail.com',
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.id).to.be.eq('id');
            expect(db.condition).to.be.deep.eq({_id: 'id'});
            expect(db.data).to.have.keys(['email', 'updatedAt']);
            expect(db.data.email).to.be.eq('new@mail.com');
            expect(db.data.updatedAt).to.be.a('date');
        });

        it('should transform an update object', async () => {
            class Database {
                public data: Partial<IUserModel>;
                public id: string;
                public condition: object;

                public update(id: string, data: any) {
                    this.id = id;
                    this.data = data;
                }

                public findOne(condition: object) {
                    this.condition = condition;
                    return 'a';
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.update('id', {
                password: '12345678',
                active: false,
                birthday: '04/17/1987',
                email: 'new@mail.com',
                firstName: 'FirstName',
                lastName: 'LastName',
                gender: null,
                groups: ['group-id'],
                role: Role.INSTRUCTOR,
                username: 'username',
                updateLastLogin: true,
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.id).to.be.eq('id');
            expect(db.condition).to.be.deep.eq({_id: 'id'});
            expect(db.data).to.have.keys([
                'password', 'active', 'birthday', 'email', 'firstName', 'lastName', 'gender', 'groups', 'role',
                'username', 'lastLogin', 'updatedAt'
            ]);
            expect(db.data.password).to.be.not.eq('12345678');
            expect(db.data.password).to.be.a('string');
            expect(db.data.password.length).to.be.gte(50);

            expect(db.data.active).to.be.eq(false);
            expect(db.data.birthday).to.be.a('date');
            expect(db.data.email).to.be.eq('new@mail.com');
            expect(db.data.firstName).to.be.eq('FirstName');
            expect(db.data.lastName).to.be.eq('LastName');
            expect(db.data.gender).to.be.eq(null);

            expect(db.data.groups).to.be.an('array');
            expect(db.data.groups).to.have.lengthOf(1);

            expect(db.data.role).to.be.eq('INSTRUCTOR');
            expect(db.data.username).to.be.eq('username');
            expect(db.data.lastLogin).to.be.a('date');

            expect(db.data.updatedAt).to.be.a('date');
        });
    });

    describe('Delete', () => {
        it('should soft delete', async () => {
            class Database {
                public data: { deleted: boolean, deletedAt: Date };
                public id: string;

                public update(id: string, data: any) {
                    this.id = id;
                    this.data = data;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);

            const result = await service.delete('id');

            expect(result).to.be.eq(undefined);
            expect(db.id).to.be.eq('id');
            expect(db.data.deleted).to.be.eq(true);
            expect(db.data.deletedAt).to.be.a('date');
        });
        it('should hard delete', async () => {
            class Database {
                public id: string;

                public delete(id: string) {
                    this.id = id;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);

            const result = await service.delete('id', true);

            expect(result).to.be.eq(undefined);
            expect(db.id).to.be.eq('id');
        });
    });

    describe('All', () => {
        it('should call all method from db', async () => {
            class Database {
                public filters: object;

                public all(filters: object) {
                    this.filters = filters;
                    return 1;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);

            const result = await service.all({role: {eq: Role.INSTRUCTOR}});
            expect(result).to.be.eq(1);
            expect(db.filters).to.be.deep.eq({role: {eq: Role.INSTRUCTOR}});
        });
    });

    describe('GetBy', () => {
        it('should raise ParameterRequired when no parameter send', async () => {
            try {
                const service = new UserService({} as any);
                await service.getBy({});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ParameterRequired');
            }
        });

        it('should throw InvalidID for invalid id', async () => {
            try {
                const service = new UserService({} as any);
                await service.getBy({id: '1'});
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('InvalidID');
            }
        });

        it('should call db findOne method for by id', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                    return 1;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result1 = await service.getBy({id: '5b4b57f4fc13ae17300008dc'});

            expect(result1).to.be.eq(1);
            expect(db.data).to.be.deep.eq({_id: '5b4b57f4fc13ae17300008dc', deleted: false});

            const result2 = await service.getBy({id: '5b4b57f4fc13ae17300008dc'}, true);
            expect(result2).to.be.eq(1);
            expect(db.data).to.be.deep.eq({_id: '5b4b57f4fc13ae17300008dc', deleted: true});

            const result3 = await service.getBy({id: '5b4b57f4fc13ae17300008dc'}, null);
            expect(result3).to.be.eq(1);
            expect(db.data).to.be.deep.eq({_id: '5b4b57f4fc13ae17300008dc'});
        });

        it('should call db findOne method for email', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                    return 1;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result1 = await service.getBy({email: 'email@mail.com'});

            expect(result1).to.be.eq(1);
            expect(db.data).to.be.deep.eq({email: 'email@mail.com', deleted: false});

            const result2 = await service.getBy({email: 'email@mail.com'}, true);
            expect(result2).to.be.eq(1);
            expect(db.data).to.be.deep.eq({email: 'email@mail.com', deleted: true});

            const result3 = await service.getBy({email: 'email@mail.com'}, null);
            expect(result3).to.be.eq(1);
            expect(db.data).to.be.deep.eq({email: 'email@mail.com'});
        });

        it('should call db findOne method for username', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                    return 1;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result1 = await service.getBy({username: 'username'});

            expect(result1).to.be.eq(1);
            expect(db.data).to.be.deep.eq({username: 'username', deleted: false});

            const result2 = await service.getBy({username: 'username'}, true);
            expect(result2).to.be.eq(1);
            expect(db.data).to.be.deep.eq({username: 'username', deleted: true});

            const result3 = await service.getBy({username: 'username'}, null);
            expect(result3).to.be.eq(1);
            expect(db.data).to.be.deep.eq({username: 'username'});
        });
    });

    describe('IsUsernameExists', () => {
        it('should normalize username', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            await service.isUsernameExists('ÜzümÇökYaprağıŞairÇam');
            expect(db.data).to.be.deep.eq({username: 'uzumcokyapragisaircam'});
        });

        it('should return true', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                    return {};
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.isUsernameExists('a');
            expect(result).to.be.eq(true);
        });

        it('should return false', async () => {
            class Database {
                public data: object;

                public findOne(condition: object) {
                    this.data = condition;
                    return null;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);
            const result = await service.isUsernameExists('a');
            expect(result).to.be.eq(false);
        });
    });

    describe('IsPasswordValid', () => {
        it('should return True', async () => {
            const service = new UserService({} as any);
            const result = await service.isPasswordValid(
                'kbowlandsik@vimeo.com',
                '$2b$10$hmeS440fxNnUx5a6ejTn.uc40rxd5j90VTiPRrpXso9au3fwVV9e6'
            );
            expect(result).to.be.eq(true);
        });
        it('should return False', async () => {
            const service = new UserService({} as any);
            const result = await service.isPasswordValid(
                '12345678',
                '$2b$10$hmeS440fxNnUx5a6ejTn.uc40rxd5j90VTiPRrpXso9au3fwVV9e6'
            );
            expect(result).to.be.eq(false);
        });
        it('should return False with not real hash', async () => {
            const service = new UserService({} as any);
            const result = await service.isPasswordValid(
                '12345678',
                'asdasdasdasdasdasd'
            );
            expect(result).to.be.eq(false);
        });
    });

    describe('HashPassword', () => {
        it('should hash password', async () => {
            const service = new UserService({} as any);
            const hash = await service.hashPassword('12345678');
            expect(hash).to.be.a('string');
            expect(hash).to.be.not.eq('12345678');
            expect(hash.length).to.be.gte(50);
        });
        it('should hash number', async () => {
            const service = new UserService({} as any);
            const hash = await service.hashPassword(12345678 as any);
            expect(hash).to.be.a('string');
            expect(hash).to.be.not.eq('12345678');
            expect(hash.length).to.be.gte(50);
        });
    });
});
