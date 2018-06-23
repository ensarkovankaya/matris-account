# Inputs

## [CompareDateInput](#comparedateinput)

Compare date information for given field. You can combine two field
such as "gt" and "lt" to make range operations.

**Fields**

- `eq`: [DateTime](types.md#datetime)

    Equal to date.

- `gt`: [DateTime](types.md#datetime)

    After than date.

- `gte`: [DateTime](types.md#datetime)

    After or equal to date.

- `lt`: [DateTime](types.md#datetime)

    Before than date.

- `lte`: [DateTime](types.md#datetime)

    Before or equal to date.

## [UpdateUserInput](#updateuserinput)

See [User](user.md) model for field descriptions.

**Fields**

- `email`: String

- `username`: String

- `firstName`: String

- `lastName`: String

- `password`: String

- `role`: [Role](../types.md#role)

- `gender`: [Gender](../types.md#gender) | null

- `active`: Boolean

- `birthday`: Date | null

- `groups`: String[]


## [CreateUserInput](#createuserinput)

See [User](user.md) model for field descriptions.

\* !: required field.

**Fields**

- `email`: String!

- `firstName`: String!

- `lastName`: String!

- `password`: String!

- `role`: [Role](../types.md#role)!

- `username`: String

- `gender`: [Gender](../types.md#gender)

- `active`: Boolean

- `birthday`: Date

- `groups`: String[]
