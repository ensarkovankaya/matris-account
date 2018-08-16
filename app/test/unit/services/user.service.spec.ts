import { expect } from 'chai';
import { describe, it } from 'mocha';
import 'reflect-metadata';
import { Gender } from '../../../src/models/gender.model';
import { Role } from '../../../src/models/role.model';
import { IUserModel } from '../../../src/models/user.model';
import { UserService } from '../../../src/services/user.service';

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
                    lastName: 'LastName',
                    username: 'username'
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
                    lastName: 'LastName',
                    username: 'username'
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
                    lastName: 'LastName',
                    username: 'username'
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
                    lastName: 'LastName',
                    username: 'username'
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
                    username: 'username'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('LastNameRequired');
            }
        });

        it('should raise UserNameRequired', async () => {
            try {
                const service = new UserService({} as any);
                await service.create({
                    role: Role.MANAGER,
                    password: '12345678',
                    email: 'email@mail.com',
                    firstName: 'FirstName',
                    lastName: 'LastName'
                } as any);
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('UserNameRequired');
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
                username: 'username',
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.data).to.be.an('object');

            expect(db.data).to.have.keys(
                ['username', 'password', 'email', 'firstName', 'lastName', 'role', 'active', 'birthday']
            );

            expect(db.data.username).to.be.eq('username');
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
                username: 'username',
                role: Role.STUDENT,
                gender: Gender.MALE,
                birthday: '06/21/1956',
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.data).to.be.an('object');

            expect(db.data).to.have.keys(['username', 'email', 'password', 'firstName',
                'lastName', 'role', 'active', 'birthday', 'gender']);

            expect(db.data.username).to.be.eq('username');
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
                gender: Gender.UNKNOWN,
                role: Role.INSTRUCTOR,
                username: 'username',
                updateLastLogin: true,
                extra: 'key'
            } as any);

            expect(result).to.be.eq('a');
            expect(db.id).to.be.eq('id');
            expect(db.condition).to.be.deep.eq({_id: 'id'});
            expect(db.data).to.have.keys([
                'password', 'active', 'birthday', 'email', 'firstName', 'lastName', 'gender', 'role',
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
            expect(db.data.gender).to.be.eq('UNKNOWN');

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
                public pagination: object;

                public all(filters: object, pagination: object) {
                    this.filters = filters;
                    this.pagination = pagination;
                    return 1;
                }
            }

            const db = new Database();
            const service = new UserService(db as any);

            const result = await service.all({role: {eq: Role.INSTRUCTOR}}, {limit: 5});
            expect(result).to.be.eq(1);
            expect(db.filters).to.be.deep.eq({role: {eq: Role.INSTRUCTOR}});
            expect(db.pagination).to.be.deep.eq({limit: 5});
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

    describe('NormalizeUserName', () => {
        it('should return same value for normalized input', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('abcdefgh');
            expect(output).to.be.eq('abcdefgh');
        });
        it('should remove empty spaces', () => {
            const service = new UserService({} as any);
            expect(service.normalizeUserName('ab cd  fg ')).to.be.eq('abcdfg');
            expect(service.normalizeUserName(' ab   cd  fg ')).to.be.eq('abcdfg');
        });
        it('should make letter lowercase', () => {
            const service = new UserService({} as any);
            expect(service.normalizeUserName('ABCDEFG')).to.be.eq('abcdefg');
            expect(service.normalizeUserName('ABCDEFGh')).to.be.eq('abcdefgh');
        });
        it('should replace all Ğ with g', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaĞaaĞaĞaaĞ');
            expect(output).to.be.eq('aagaagagaag');
        });
        it('should replace all ğ with g', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aağaağağaağ');
            expect(output).to.be.eq('aagaagagaag');
        });
        it('should replace all ü with u', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaüaaüaüaaü');
            expect(output).to.be.eq('aauaauauaau');
        });
        it('should replace all Ü with u', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaÜaaÜaÜaaÜ');
            expect(output).to.be.eq('aauaauauaau');
        });
        it('should replace all ç with c', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaçaçaaça');
            expect(output).to.be.eq('aacacaaca');
        });
        it('should replace all Ç with c', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaÇaÇaaÇa');
            expect(output).to.be.eq('aacacaaca');
        });
        it('should replace all ş with s', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaşaşaaşa');
            expect(output).to.be.eq('aasasaasa');
        });
        it('should replace all Ş with s', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaŞaŞaaŞa');
            expect(output).to.be.eq('aasasaasa');
        });
        it('should replace all ı with i', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaıaıaaıa');
            expect(output).to.be.eq('aaiaiaaia');
        });
        it('should replace all I with i', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaIaIaaIa');
            expect(output).to.be.eq('aaiaiaaia');
        });
        it('should replace all ö with o', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaöaöaaöa');
            expect(output).to.be.eq('aaoaoaaoa');
        });
        it('should replace all Ö with o', () => {
            const service = new UserService({} as any);
            const output = service.normalizeUserName('aaÖaÖaaÖa');
            expect(output).to.be.eq('aaoaoaaoa');
        });
    });

    describe('GenerateUsername', () => {
        it('username should start with user if not initial given', () => {
            const service = new UserService({} as any);
            const output = service.generateUserName();
            expect(output.startsWith('user')).to.be.eq(true);
            expect(output).to.have.lengthOf(8);
        });

        it('username should start with given initial', () => {
            const service = new UserService({} as any);
            const output = service.generateUserName('username');
            expect(output.startsWith('username')).to.be.eq(true);
            expect(output).to.have.lengthOf(12);
        });

        it('should add random numbers to given initial', () => {
            const service = new UserService({} as any);
            const output = service.generateUserName('username');
            const numbers = parseInt(output.split('username')[1], 10);
            expect(numbers).to.be.a('number');
        });

        it('should cut username if initial bigger than maxLength', () => {
            const service = new UserService({} as any);
            const output = service.generateUserName('username', 10);
            expect(output).to.have.lengthOf(10);
        });
    });
});
