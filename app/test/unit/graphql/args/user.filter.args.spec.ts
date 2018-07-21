import { expect } from 'chai';
import { describe, it } from 'mocha';
import "reflect-metadata";
import { UserFilterInput } from '../../../../src/graphql/inputs/user.filter.input';
import { Gender, Role } from '../../../../src/models/user.model';

class ShouldNotSucceed extends Error {
    public name = 'ShouldNotSucceed';
}

describe('GraphQL -> Inputs -> UserFilterArgs', () => {
    it('should be valid for empty object', async () => {
        const input = new UserFilterInput();
        await input.validate();
        expect(input).to.be.deep.eq({});
    });

    describe('Active', () => {
        it('should be valid', async () => {
            const input1 = new UserFilterInput({active: true});
            await input1.validate();
            expect(input1).to.be.deep.eq({active: true});

            const input2 = new UserFilterInput({active: false});
            await input2.validate();
            expect(input2).to.be.deep.eq({active: false});
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserFilterInput({active: ''}).validate();
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
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({gender: {}});
            await input.validate();
            expect(input).to.be.deep.eq({gender: {}});
        });

        describe('eq', () => {
            it('should be valid', async () => {
                const input1 = new UserFilterInput({gender: {eq: Gender.MALE}});
                await input1.validate();
                expect(input1).to.be.deep.eq({gender: {eq: 'MALE'}});

                const input2 = new UserFilterInput({gender: {eq: Gender.FEMALE}});
                await input2.validate();
                expect(input2).to.be.deep.eq({gender: {eq: 'FEMALE'}});

                const input3 = new UserFilterInput({gender: {eq: null}});
                await input3.validate();
                expect(input3).to.be.deep.eq({gender: {eq: null}});
            });
            it('should raise ValidationError', async () => {
                try {
                    await new UserFilterInput({gender: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('gender');
                    expect(err.constraints).to.have.key('isGenderQuery');
                }
            });
        });

        describe('in', () => {
            it('should be valid', async () => {
                const input1 = new UserFilterInput({gender: {in: [Gender.MALE]}});
                await input1.validate();
                expect(input1).to.be.deep.eq({gender: {in: ['MALE']}});

                const input2 = new UserFilterInput({gender: {in: [Gender.FEMALE]}});
                await input2.validate();
                expect(input2).to.be.deep.eq({gender: {in: ['FEMALE']}});

                const input3 = new UserFilterInput({gender: {in: [null]}});
                await input3.validate();
                expect(input3).to.be.deep.eq({gender: {in: [null]}});

                const input4 = new UserFilterInput({gender: {in: [Gender.MALE, null]}});
                await input4.validate();
                expect(input4).to.be.deep.eq({gender: {in: ['MALE', null]}});

                const input5 = new UserFilterInput({gender: {in: [Gender.FEMALE, null]}});
                await input5.validate();
                expect(input5).to.be.deep.eq({gender: {in: ['FEMALE', null]}});

                const input6 = new UserFilterInput({gender: {in: [Gender.MALE, Gender.FEMALE]}});
                await input6.validate();
                expect(input6).to.be.deep.eq({gender: {in: ['MALE', 'FEMALE']}});

                const input7 = new UserFilterInput({gender: {in: [Gender.MALE, Gender.FEMALE, null]}});
                await input7.validate();
                expect(input7).to.be.deep.eq({gender: {in: ['MALE', 'FEMALE', null]}});

                const input8 = new UserFilterInput({gender: {in: []}});
                await input8.validate();
                expect(input8).to.be.deep.eq({gender: {in: []}});
            });

            it('should raise ValidationError', async () => {
                try {
                    await new UserFilterInput({gender: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('gender');
                    expect(err.constraints).to.have.key('isGenderQuery');
                }

                try {
                    await new UserFilterInput({gender: {in: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('gender');
                    expect(err.constraints).to.have.key('isGenderQuery');
                }

                try {
                    await new UserFilterInput({gender: {in: ['asd']}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('gender');
                    expect(err.constraints).to.have.key('isGenderQuery');
                }
            });
        });
    });

    describe('Role', () => {
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({role: {}});
            await input.validate();
            expect(input).to.be.deep.eq({role: {}});
        });

        describe('eq', () => {
            it('should be valid', async () => {
                const input1 = new UserFilterInput({role: {eq: Role.ADMIN}});
                await input1.validate();
                expect(input1).to.be.deep.eq({role: {eq: 'ADMIN'}});

                const input2 = new UserFilterInput({role: {eq: Role.INSTRUCTOR}});
                await input2.validate();
                expect(input2).to.be.deep.eq({role: {eq: 'INSTRUCTOR'}});

                const input3 = new UserFilterInput({role: {eq: Role.MANAGER}});
                await input3.validate();
                expect(input3).to.be.deep.eq({role: {eq: 'MANAGER'}});

                const input4 = new UserFilterInput({role: {eq: Role.PARENT}});
                await input4.validate();
                expect(input4).to.be.deep.eq({role: {eq: 'PARENT'}});

                const input5 = new UserFilterInput({role: {eq: Role.STUDENT}});
                await input5.validate();
                expect(input5).to.be.deep.eq({role: {eq: 'STUDENT'}});
            });

            it('should raise ValidationError', async () => {
                try {
                    await new UserFilterInput({role: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('role');
                    expect(err.constraints).to.have.key('isRoleQuery');
                }
            });
        });

        describe('in', () => {
            it('should be valid', async () => {
                const input1 = new UserFilterInput({role: {in: [Role.ADMIN]}});
                await input1.validate();
                expect(input1).to.be.deep.eq({role: {in: ['ADMIN']}});

                const input2 = new UserFilterInput({role: {in: [Role.MANAGER]}});
                await input2.validate();
                expect(input2).to.be.deep.eq({role: {in: ['MANAGER']}});

                const input3 = new UserFilterInput({role: {in: [Role.INSTRUCTOR]}});
                await input3.validate();
                expect(input3).to.be.deep.eq({role: {in: ['INSTRUCTOR']}});

                const input4 = new UserFilterInput({role: {in: [Role.PARENT]}});
                await input4.validate();
                expect(input4).to.be.deep.eq({role: {in: ['PARENT']}});

                const input5 = new UserFilterInput({role: {in: [Role.STUDENT]}});
                await input5.validate();
                expect(input5).to.be.deep.eq({role: {in: ['STUDENT']}});

                const input6 = new UserFilterInput({role: {in: [Role.ADMIN, Role.STUDENT]}});
                await input6.validate();
                expect(input6).to.be.deep.eq({role: {in: ['ADMIN', 'STUDENT']}});

                const input7 = new UserFilterInput({role: {in: [Role.PARENT, Role.INSTRUCTOR, Role.STUDENT]}});
                await input7.validate();
                expect(input7).to.be.deep.eq({role: {in: ['PARENT', 'INSTRUCTOR', 'STUDENT']}});

                const input8 = new UserFilterInput({role: {in: []}});
                await input8.validate();
                expect(input8).to.be.deep.eq({role: {in: []}});
            });

            it('should raise ValidationError', async () => {
                try {
                    await new UserFilterInput({role: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('role');
                    expect(err.constraints).to.have.key('isRoleQuery');
                }

                try {
                    await new UserFilterInput({role: {in: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('role');
                    expect(err.constraints).to.have.key('isRoleQuery');
                }

                try {
                    await new UserFilterInput({role: {in: ['asd']}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('role');
                    expect(err.constraints).to.have.key('isRoleQuery');
                }
            });
        });
    });

    describe('Deleted', () => {
        it('should be valid', async () => {
            const input1 = new UserFilterInput({deleted: true});
            await input1.validate();
            expect(input1).to.be.deep.eq({deleted: true});

            const input2 = new UserFilterInput({deleted: false});
            await input2.validate();
            expect(input2).to.be.deep.eq({deleted: false});
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserFilterInput({deleted: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('deleted');
                expect(err.constraints).to.have.key('isBoolean');
            }
        });
    });

    describe('DeletedAt', () => {
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({deletedAt: {}});
            await input.validate();
            expect(input).to.be.deep.eq({deletedAt: {}});
        });

        describe('eq', () => {
            it('should be valid for eq', async () => {
                const input = new UserFilterInput({deletedAt: {eq: new Date()}});
                await input.validate();
                expect(input.deletedAt.eq).to.be.a('date');
            });

            it('should raise ValidationError for eq is Invalid Date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {eq: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for eq is not a date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gt', () => {
            it('should be valid for gt', async () => {
                const input = new UserFilterInput({deletedAt: {gt: new Date()}});
                await input.validate();
                expect(input.deletedAt.gt).to.be.a('date');
            });

            it('should raise ValidationError for gt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {gt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gt is not a date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {gt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gte', () => {
            it('should be valid for gte', async () => {
                const input = new UserFilterInput({deletedAt: {gte: new Date()}});
                await input.validate();
                expect(input.deletedAt.gte).to.be.a('date');
            });

            it('should raise ValidationError for gte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {gte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gte is not a date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {gte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('LT', () => {
            it('should be valid for lt', async () => {
                const input = new UserFilterInput({deletedAt: {lt: new Date()}});
                await input.validate();
                expect(input.deletedAt.lt).to.be.a('date');
            });

            it('should raise ValidationError for lt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {lt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lt is not a date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {lt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('lte', () => {
            it('should be valid for lte', async () => {
                const input = new UserFilterInput({deletedAt: {lte: new Date()}});
                await input.validate();
                expect(input.deletedAt.lte).to.be.a('date');
            });

            it('should raise ValidationError for lte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {lte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lte is not a date', async () => {
                try {
                    await new UserFilterInput({deletedAt: {lte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('deletedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });
    });

    describe('CreatedAt', () => {
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({createdAt: {}});
            await input.validate();
            expect(input).to.be.deep.eq({createdAt: {}});
        });

        describe('eq', () => {
            it('should be valid for eq', async () => {
                const input = new UserFilterInput({createdAt: {eq: new Date()}});
                await input.validate();
                expect(input.createdAt.eq).to.be.a('date');
            });

            it('should raise ValidationError for eq is Invalid Date', async () => {
                try {
                    await new UserFilterInput({createdAt: {eq: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for eq is not a date', async () => {
                try {
                    await new UserFilterInput({createdAt: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gt', () => {
            it('should be valid for gt', async () => {
                const input = new UserFilterInput({createdAt: {gt: new Date()}});
                await input.validate();
                expect(input.createdAt.gt).to.be.a('date');
            });

            it('should raise ValidationError for gt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({createdAt: {gt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gt is not a date', async () => {
                try {
                    await new UserFilterInput({createdAt: {gt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gte', () => {
            it('should be valid for gte', async () => {
                const input = new UserFilterInput({createdAt: {gte: new Date()}});
                await input.validate();
                expect(input.createdAt.gte).to.be.a('date');
            });

            it('should raise ValidationError for gte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({createdAt: {gte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gte is not a date', async () => {
                try {
                    await new UserFilterInput({createdAt: {gte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('LT', () => {
            it('should be valid for lt', async () => {
                const input = new UserFilterInput({createdAt: {lt: new Date()}});
                await input.validate();
                expect(input.createdAt.lt).to.be.a('date');
            });

            it('should raise ValidationError for lt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({createdAt: {lt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lt is not a date', async () => {
                try {
                    await new UserFilterInput({createdAt: {lt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('lte', () => {
            it('should be valid for lte', async () => {
                const input = new UserFilterInput({createdAt: {lte: new Date()}});
                await input.validate();
                expect(input.createdAt.lte).to.be.a('date');
            });

            it('should raise ValidationError for lte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({createdAt: {lte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lte is not a date', async () => {
                try {
                    await new UserFilterInput({createdAt: {lte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('createdAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });
    });

    describe('UpdatedAt', () => {
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({updatedAt: {}});
            await input.validate();
            expect(input).to.be.deep.eq({updatedAt: {}});
        });

        describe('eq', () => {
            it('should be valid for eq', async () => {
                const input = new UserFilterInput({updatedAt: {eq: new Date()}});
                await input.validate();
                expect(input.updatedAt.eq).to.be.a('date');
            });

            it('should raise ValidationError for eq is Invalid Date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {eq: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for eq is not a date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gt', () => {
            it('should be valid for gt', async () => {
                const input = new UserFilterInput({updatedAt: {gt: new Date()}});
                await input.validate();
                expect(input.updatedAt.gt).to.be.a('date');
            });

            it('should raise ValidationError for gt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {gt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gt is not a date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {gt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gte', () => {
            it('should be valid for gte', async () => {
                const input = new UserFilterInput({updatedAt: {gte: new Date()}});
                await input.validate();
                expect(input.updatedAt.gte).to.be.a('date');
            });

            it('should raise ValidationError for gte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {gte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gte is not a date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {gte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('LT', () => {
            it('should be valid for lt', async () => {
                const input = new UserFilterInput({updatedAt: {lt: new Date()}});
                await input.validate();
                expect(input.updatedAt.lt).to.be.a('date');
            });

            it('should raise ValidationError for lt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {lt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lt is not a date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {lt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('lte', () => {
            it('should be valid for lte', async () => {
                const input = new UserFilterInput({updatedAt: {lte: new Date()}});
                await input.validate();
                expect(input.updatedAt.lte).to.be.a('date');
            });

            it('should raise ValidationError for lte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {lte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lte is not a date', async () => {
                try {
                    await new UserFilterInput({updatedAt: {lte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('updatedAt');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });
    });

    describe('LastLogin', () => {
        it('should be valid for empty object', async () => {
            const input = new UserFilterInput({lastLogin: {}});
            await input.validate();
            expect(input).to.be.deep.eq({lastLogin: {}});
        });

        describe('eq', () => {
            it('should be valid for eq', async () => {
                const input = new UserFilterInput({lastLogin: {eq: new Date()}});
                await input.validate();
                expect(input.lastLogin.eq).to.be.a('date');
            });

            it('should raise ValidationError for eq is Invalid Date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {eq: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for eq is not a date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {eq: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gt', () => {
            it('should be valid for gt', async () => {
                const input = new UserFilterInput({lastLogin: {gt: new Date()}});
                await input.validate();
                expect(input.lastLogin.gt).to.be.a('date');
            });

            it('should raise ValidationError for gt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {gt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gt is not a date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {gt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('gte', () => {
            it('should be valid for gte', async () => {
                const input = new UserFilterInput({lastLogin: {gte: new Date()}});
                await input.validate();
                expect(input.lastLogin.gte).to.be.a('date');
            });

            it('should raise ValidationError for gte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {gte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for gte is not a date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {gte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('LT', () => {
            it('should be valid for lt', async () => {
                const input = new UserFilterInput({lastLogin: {lt: new Date()}});
                await input.validate();
                expect(input.lastLogin.lt).to.be.a('date');
            });

            it('should raise ValidationError for lt is Invalid Date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {lt: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lt is not a date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {lt: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });

        describe('lte', () => {
            it('should be valid for lte', async () => {
                const input = new UserFilterInput({lastLogin: {lte: new Date()}});
                await input.validate();
                expect(input.lastLogin.lte).to.be.a('date');
            });

            it('should raise ValidationError for lte is Invalid Date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {lte: new Date('asd')}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });

            it('should raise ValidationError for lte is not a date', async () => {
                try {
                    await new UserFilterInput({lastLogin: {lte: 'asd'}}).validate();
                    throw new ShouldNotSucceed();
                } catch (e) {
                    expect(e).to.be.an('array');
                    expect(e).to.have.lengthOf(1);
                    const err = e[0];
                    expect(err.property).to.be.eq('lastLogin');
                    expect(err.constraints).to.have.key('isCompareDateInput');
                }
            });
        });
    });

    describe('Groups', () => {
        it('should be valid', async () => {
            const input1 = new UserFilterInput({groups: []});
            await input1.validate();
            expect(input1.groups).to.be.an('array');
            expect(input1.groups).to.have.lengthOf(0);

            const input2 = new UserFilterInput({groups: ['i'.repeat(24)]});
            await input2.validate();
            expect(input2.groups).to.be.an('array');
            expect(input2.groups).to.have.lengthOf(1);
        });

        it('should raise ValidationError', async () => {
            try {
                await new UserFilterInput({groups: 'asd'}).validate();
                throw new ShouldNotSucceed();
            } catch (e) {
                expect(e).to.be.an('array');
                expect(e).to.have.lengthOf(1);
                const err = e[0];
                expect(err.property).to.be.eq('groups');
                expect(err.constraints).to.have.key('isArray');
            }

            try {
                await new UserFilterInput({groups: ['id']}).validate();
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
