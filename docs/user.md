# User

User object model.

## Fields

- `_id`: String

    User unique id.

- `email`: String

    User unique email address.

- `username`: String

    User unique username.

- `firstName`: String

    User first name.

- `lastName`: String

    User last name.

- `role`: [Role](../types.md#role)

    User role.

- `gender`: [Gender](../types.md#gender) | null

    User gender.

- `active`: Boolean

    Is user account active.

- `birthday`: Date | null

    User birthday date.

- `createdAt`: Date

    User account create date.

- `updatedAt`: Date

    User account update date.

- `lastLogin`: Date | null

    User last login date. If user never logged in field will be null.

- `deletedAt`: Date | null

    User account delete date. If not deleted will be null.

- `deleted`: Boolean

    Is user account deleted.

- `groups`: String[]

    User associated group ids.
