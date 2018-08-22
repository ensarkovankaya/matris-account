# User Filter Input Model

```
{
    active?: boolean;
    gender?: GenderQuery;
    role?: RoleQuery;
    deleted?: boolean;
    createdAt?: CompareDateInput;
    updatedAt?: CompareDateInput;
    deletedAt?: CompareDateInput;
    lastLogin?: CompareDateInput;
    birthday?: CompareDateInput;
}
```

- `active`: Boolean.

    Is user active.

- `gender`: [GenderQuery](./gender.query.md)

    User gender.

- `role`: [RoleQuery](./role.query.md)

    User role.

- `deleted`: Boolean.

    Is user deleted.

- `createdAt`: [CompareDateInput](../input.md#comparedateinput)

    User created date.

- `updatedAt`: [CompareDateInput](../input.md#comparedateinput)

    User updated date.

- `deletedAt`: [CompareDateInput](../input.md#comparedateinput)

    User deleted date.

- `lastLogin`: [CompareDateInput](../input.md#comparedateinput)

    User last login date.

- `birthday`: [CompareDateInput](../input.md#comparedateinput)

    User birthday.
