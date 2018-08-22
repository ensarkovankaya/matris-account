# User Model

User object model.

## Fields

- `_id`: String

    User unique id. Set by database.

- `email`: String

    User unique email address.

- `username`: String

    User unique username. Must be alphanumeric and lowercase.

- `firstName`: String

    User first name. Min length 0, max length 32. Only contains lowercase, uppercase characters and empty spaces.

- `lastName`: String

    User last name.  Min length 0, max length 32. Only contains lowercase, uppercase characters and empty spaces.

- `role`: [Role](../types.md#role)

    User role.

- `gender`: [Gender](../types.md#gender)

    User gender.

- `active`: Boolean

    Is user account active.

- `birthday`: [Date](../types.md#date) | null

    User birthday date. Can be as undefined.

- `createdAt`: [Date](../types.md#date)

    User account create date.

- `updatedAt`: [Date](../types.md#date)

    User account update date.

- `lastLogin`: [Date](../types.md#date) | null

    User last login date. If user never logged in field will be null.

- `deletedAt`: [Date](../types.md#date) | null

    User account delete date. If not deleted will be null.

- `deleted`: Boolean

    Is user account deleted.
