# Create Input

```
{
    email: string;
    role: Role;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    active?: boolean;
    gender?: Gender;
    birthday?: Date | null;
}
```

- `email`: Required. User email.

- `role`: Required. [Role](../models/role.md). User role.

- `password`: Required. User password. Min length 8, max length 40.

- `firstName`: Optional. User first name. Min length 0, max length 32.

- `lastName`: Optional. User last name. Min length 0, max length 32.

- `username`: Optional. User username. Must be unique, If not given will auto generated.

- `active`: Optional. Marks user account as active or inactive.

- `gender`: Optional. [Gender](../models/gender.md). Default is **UNKNOWN**.

- `birthday`: Optinal. User birthday. Default **null**.