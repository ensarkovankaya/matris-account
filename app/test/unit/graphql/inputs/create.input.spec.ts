import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { CreateInput } from '../../../../src/graphql/inputs/create.input';
import { Gender } from '../../../../src/models/gender.model';
import { Role } from '../../../../src/models/role.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> Create', () => {
    it('should have validate function ', () => {
        const input = new CreateInput({} as any);
        expect(input.validate).to.be.a('function');
    });

    describe('Email', () => {
        it('should be valid', async () => {
            try {
                const input = new CreateInput({email: 'email@mail.com'} as any);
                expect(input).to.have.keys(['email']);
                expect(input.email).to.be.eq('email@mail.com');
                await input.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({email: 'notaemail'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('email', 'isEmail')).to.be.eq(true);
            }
        });
    });

    describe('FirstName', () => {
        it('should be valid', async () => {
            try {
                const input = new CreateInput({firstName: 'First Name'} as any);
                expect(input).to.have.keys(['firstName']);
                expect(input.firstName).to.be.eq('First Name');
                await input.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName')).to.be.eq(false);
            }

            try {
                await new CreateInput({firstName: ''} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({firstName: 'F'.repeat(33)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName', 'length')).to.be.eq(true);
            }

            try {
                await new CreateInput({firstName: 'First123'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName', 'matches')).to.be.eq(true);
            }

            try {
                await new CreateInput({firstName: 'name-*_'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('firstName', 'matches')).to.be.eq(true);
            }
        });
    });

    describe('LastName', () => {
        it('should be valid', async () => {
            try {
                const input = new CreateInput({lastName: 'Last Name'} as any);
                expect(input).to.have.keys(['lastName']);
                expect(input.lastName).to.be.eq('Last Name');
                await input.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lastName')).to.be.eq(false);
            }

            try {
                await new CreateInput({lastName: ''} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lastName')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({lastName: 'F'.repeat(33)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lastName', 'length')).to.be.eq(true);
            }

            try {
                await new CreateInput({lastName: 'Last123'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lastName', 'matches')).to.be.eq(true);
            }

            try {
                await new CreateInput({lastName: 'name-*_'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('lastName', 'matches')).to.be.eq(true);
            }
        });
    });

    describe('Role', () => {
        it('should be valid', async () => {
            try {
                const input1 = new CreateInput({role: Role.ADMIN} as any);
                expect(input1).to.have.keys(['role']);
                expect(input1.role).to.be.eq('ADMIN');
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role')).to.be.eq(false);
            }

            try {
                const input2 = new CreateInput({role: Role.INSTRUCTOR} as any);
                expect(input2).to.have.keys(['role']);
                expect(input2.role).to.be.eq('INSTRUCTOR');
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role')).to.be.eq(false);
            }

            try {
                const input3 = new CreateInput({role: Role.MANAGER} as any);
                await input3.validate();
                expect(input3).to.have.keys(['role']);
                expect(input3.role).to.be.eq('MANAGER');
                await input3.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role')).to.be.eq(false);
            }

            try {
                const input4 = new CreateInput({role: Role.PARENT} as any);
                await input4.validate();
                expect(input4).to.have.keys(['role']);
                expect(input4.role).to.be.eq('PARENT');
                await input4.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role')).to.be.eq(false);
            }

            try {
                const input5 = new CreateInput({role: Role.STUDENT} as any);
                await input5.validate();
                expect(input5).to.have.keys(['role']);
                expect(input5.role).to.be.eq('STUDENT');
                await input5.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({role: 'NotARole'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('role', 'isIn')).to.be.eq(true);
            }
        });
    });

    describe('Password', () => {
        it('should be valid', async () => {
            try {
                const input1 = new CreateInput({password: '12345678'} as any);
                expect(input1).to.have.keys(['password']);
                expect(input1.password).to.be.eq('12345678');
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password')).to.be.eq(false);
            }

            try {
                const input2 = new CreateInput({password: '1237aysd.1öças-*149-*'} as any);
                expect(input2).to.have.keys(['password']);
                expect(input2.password).to.be.eq('1237aysd.1öças-*149-*');
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({password: ''} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password', 'length')).to.be.eq(true);
            }

            try {
                await new CreateInput({password: 'a'.repeat(41)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('password', 'length')).to.be.eq(true);
            }
        });
    });

    describe('Username', () => {
        it('should be valid', async () => {
            try {
                const input = new CreateInput({username: 'username'} as any);
                expect(input).to.have.keys(['username']);
                expect(input.username).to.be.eq('username');
                await input.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({username: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'length')).to.be.eq(true);
            }

            try {
                await new CreateInput({username: 'a'.repeat(33)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'length')).to.be.eq(true);
            }

            try {
                await new CreateInput({username: 'userName'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'isLowercase')).to.be.eq(true);
            }

            try {
                await new CreateInput({username: 'username-123'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('username', 'isAlphanumeric')).to.be.eq(true);
            }
        });
    });

    describe('Active', () => {
        it('should be valid', async () => {
            try {
                const input1 = new CreateInput({active: true} as any);
                expect(input1).to.have.keys(['active']);
                expect(input1.active).to.be.eq(true);
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('active')).to.be.eq(false);
            }

            try {
                const input2 = new CreateInput({active: false} as any);
                expect(input2).to.have.keys(['active']);
                expect(input2.active).to.be.eq(false);
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('active')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({active: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('active', 'isBoolean')).to.be.eq(true);
            }
        });
    });

    describe('Gender', () => {
        it('should be valid', async () => {
            try {
                const input1 = new CreateInput({gender: Gender.MALE} as any);
                expect(input1).to.have.keys(['gender']);
                expect(input1.gender).to.be.eq('MALE');
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gender')).to.be.eq(false);
            }

            try {
                const input2 = new CreateInput({gender: Gender.FEMALE} as any);
                expect(input2).to.have.keys(['gender']);
                expect(input2.gender).to.be.eq('FEMALE');
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gender')).to.be.eq(false);
            }

            try {
                const input3 = new CreateInput({gender: 'UNKNOWN'} as any);
                expect(input3).to.have.keys(['gender']);
                expect(input3.gender).to.be.eq('UNKNOWN');
                await input3.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gender')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({gender: 'asd'} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('gender', 'isIn')).to.be.eq(true);
            }
        });
    });

    describe('Birthday', () => {
        it('should be valid', async () => {
            try {
                const input1 = new CreateInput({birthday: new Date(1994, 2, 3)} as any);
                expect(input1.birthday).to.be.a('date');
                await input1.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('birthday')).to.be.eq(false);
            }

            try {
                const input2 = new CreateInput({birthday: '04/19/1995'} as any);
                expect(input2.birthday).to.be.a('date');
                expect(input2.birthday.getFullYear()).to.be.eq(1995);
                expect(input2.birthday.getDate()).to.be.eq(19);
                expect(input2.birthday.getMonth()).to.be.eq(3); // Months are zero indexed
                await input2.validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('birthday')).to.be.eq(false);
            }
        });

        it('should raise ValidationError', async () => {
            try {
                await new CreateInput({birthday: new Date('asd')} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('InvalidDate');
            }

            try {
                await new CreateInput({birthday: new Date(2001, 1, 1)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('birthday', 'isInDateRange')).to.be.eq(true);
            }

            try {
                await new CreateInput({birthday: new Date(1945, 1, 1)} as any).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e.name).to.be.eq('ArgumentValidationError');
                expect(e.hasError('birthday', 'isInDateRange')).to.be.eq(true);
            }
        });
    });
});
