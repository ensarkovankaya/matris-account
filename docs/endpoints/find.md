# Query: Find

Search and filter users.

Returns: [User](../user.md)\[\]

## Args

Query filter arguments if not

- `active`: Boolean.

    Is user active.

- `gender`: [Gender](../types.md#gender)

    User gender.

- `role`: [Gender](../types.md#gender)

    User role.

- `deleted`: Boolean.

    Is account deleted.

- `createdAt`: [CompareDateInput](../input.md#comparedateinput)

    Account created date.

- `updatedAt`: [CompareDateInput](../input.md#comparedateinput)

    Account updated date.

- `deletedAt`: [CompareDateInput](../input.md#comparedateinput)

    Account deleted date.

- `lastLogin`: [CompareDateInput](../input.md#comparedateinput)

    Account last login date.

### [RoleQuery](#rolequery)

Gender query input.

- `eq`: [Gender](../types.md#gender)

- `in`: \[[Gender](../types.md#gender)\]
