import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { IsInDateRange } from '../../../../src/decorators/date';
import { CreateInput } from '../../../../src/graphql/inputs/create.input';
import { Gender, Role } from '../../../../src/models/user.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> Create', () => {
    it('should have validate function ', () => {
        const input = new CreateInput();
        expect(input.validate).to.be.a('function');
    });

    describe('Email', () => {
        it('should be valid', async () => {
            const input = new CreateInput({email: 'email@mail.com'});
            await input.validate();
            expect(input).to.have.keys(['email']);
            expect(input.email).to.be.eq('email@mail.com');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({email: 'notaemail'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('email');
                expect(err.constraints).to.have.key('isEmail');
            }
        });
    });

    describe('First Name', () => {
        it('should be valid', async () => {
            const input = new CreateInput({firstName: 'First Name'});
            await input.validate();
            expect(input).to.have.keys(['firstName']);
            expect(input.firstName).to.be.eq('First Name');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({firstName: 'F'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('firstName');
                expect(err.constraints).to.have.keys(['length', 'matches']);
            }

            try {
                await new CreateInput({firstName: 'F'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('firstName');
                expect(err.constraints).to.have.keys(['length']);
            }

            try {
                await new CreateInput({firstName: 'First123'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('firstName');
                expect(err.constraints).to.have.keys(['matches']);
            }

            try {
                await new CreateInput({firstName: 'name-*_'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('firstName');
                expect(err.constraints).to.have.keys(['matches']);
            }
        });
    });

    describe('Last Name', () => {
        it('should be valid', async () => {
            const input = new CreateInput({lastName: 'Last Name'});
            await input.validate();
            expect(input).to.have.keys(['lastName']);
            expect(input.lastName).to.be.eq('Last Name');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({lastName: 'F'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lastName');
                expect(err.constraints).to.have.keys(['length', 'matches']);
            }

            try {
                await new CreateInput({lastName: 'F'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lastName');
                expect(err.constraints).to.have.keys(['length']);
            }

            try {
                await new CreateInput({lastName: 'Last123'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lastName');
                expect(err.constraints).to.have.keys(['matches']);
            }

            try {
                await new CreateInput({lastName: 'name-*_'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('lastName');
                expect(err.constraints).to.have.keys(['matches']);
            }
        });
    });

    describe('Role', () => {
        it('should be valid', async () => {
            const input1 = new CreateInput({role: Role.ADMIN});
            await input1.validate();
            expect(input1).to.have.keys(['role']);
            expect(input1.role).to.be.eq('ADMIN');

            const input2 = new CreateInput({role: Role.INSTRUCTOR});
            await input2.validate();
            expect(input2).to.have.keys(['role']);
            expect(input2.role).to.be.eq('INSTRUCTOR');

            const input3 = new CreateInput({role: Role.MANAGER});
            await input3.validate();
            expect(input3).to.have.keys(['role']);
            expect(input3.role).to.be.eq('MANAGER');

            const input4 = new CreateInput({role: Role.PARENT});
            await input4.validate();
            expect(input4).to.have.keys(['role']);
            expect(input4.role).to.be.eq('PARENT');

            const input5 = new CreateInput({role: Role.STUDENT});
            await input5.validate();
            expect(input5).to.have.keys(['role']);
            expect(input5.role).to.be.eq('STUDENT');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({role: 'NotARole'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('role');
                expect(err.constraints).to.have.key('isIn');
            }
        });
    });

    describe('Password', () => {
        it('should be valid', async () => {
            const input = new CreateInput({password: '12345678'});
            await input.validate();
            expect(input).to.have.keys(['password']);
            expect(input.password).to.be.eq('12345678');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({password: '123456'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('password');
                expect(err.constraints).to.have.key('length');
            }

            try {
                await new CreateInput({password: '1'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('password');
                expect(err.constraints).to.have.key('length');
            }
        });
    });

    describe('Username', () => {
        it('should be valid', async () => {
            const input = new CreateInput({username: 'username'});
            await input.validate();
            expect(input).to.have.keys(['username']);
            expect(input.username).to.be.eq('username');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({username: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('username');
                expect(err.constraints).to.have.key('length');
            }

            try {
                await new CreateInput({username: 'a'.repeat(33)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('username');
                expect(err.constraints).to.have.key('length');
            }

            try {
                await new CreateInput({username: 'userName'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('username');
                expect(err.constraints).to.have.key('isLowercase');
            }

            try {
                await new CreateInput({username: 'username-123'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('username');
                expect(err.constraints).to.have.key('isAlphanumeric');
            }
        });
    });

    describe('Active', () => {
        it('should be valid', async () => {
            const input1 = new CreateInput({active: true});
            await input1.validate();
            expect(input1).to.have.keys(['active']);
            expect(input1.active).to.be.eq(true);

            const input2 = new CreateInput({active: false});
            await input2.validate();
            expect(input2).to.have.keys(['active']);
            expect(input2.active).to.be.eq(false);
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({active: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('active');
                expect(err.constraints).to.have.key('isBoolean');
            }
        });
    });

    describe('Gender', () => {
        it('should be valid', async () => {
            const input1 = new CreateInput({gender: Gender.MALE});
            await input1.validate();
            expect(input1).to.have.keys(['gender']);
            expect(input1.gender).to.be.eq('MALE');

            const input2 = new CreateInput({gender: Gender.FEMALE});
            await input2.validate();
            expect(input2).to.have.keys(['gender']);
            expect(input2.gender).to.be.eq('FEMALE');

            const input3 = new CreateInput({gender: null});
            await input3.validate();
            expect(input3).to.have.keys(['gender']);
            expect(input3.gender).to.be.eq(null);
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({gender: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('gender');
                expect(err.constraints).to.have.key('isIn');
            }
        });
    });

    describe('Birthday', () => {
        it('should be valid', async () => {
            const input1 = new CreateInput({birthday: new Date(1994, 2, 3)});
            await input1.validate();
            expect(input1.birthday).to.be.a('date');

            const input2 = new CreateInput({birthday: '04/19/1995'});
            await input2.validate();
            expect(input2.birthday).to.be.eq('04/19/1995');
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({birthday: new Date('asd')}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('InvalidDate');
            }

            try {
                await new CreateInput({birthday: new Date(2001, 1, 1)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('birthday');
                expect(err.constraints).to.have.key('isInDateRange');
            }

            try {
                await new CreateInput({birthday: new Date(1945, 1, 1)}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('birthday');
                expect(err.constraints).to.have.key('isInDateRange');
            }
        });
    });

    describe('Groups', () => {
        it('should be valid', async () => {
            const input1 = new CreateInput({groups: []});
            await input1.validate();
            expect(input1.groups).to.be.an('array');
            expect(input1.groups).to.have.lengthOf(0);

            const input2 = new CreateInput({groups: ['i'.repeat(24)]});
            await input2.validate();
            expect(input2.groups).to.be.an('array');
            expect(input2.groups).to.have.lengthOf(1);
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({groups: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('groups');
                expect(err.constraints).to.have.key('isArray');
            }

            try {
                await new CreateInput({groups: ['id']}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('groups');
                expect(err.constraints).to.have.key('length');
            }
        });
    });
});
