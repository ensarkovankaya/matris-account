export class UserNotFound extends Error {
    public name = 'UserNotFound';

    constructor(id?: string) {
        super(id ? `User not found with ID: ${id}` : 'User not found');
    }
}

export class EmailAlreadyExists extends Error {
    public name = 'EmailAlreadyExists';

    constructor(email?: string) {
        super(email ? `Email '${email}' already exists` : 'Email already exists');
    }
}

export class UserNameExists extends Error {
    public name = 'UserNameExists';

    constructor(username?: string) {
        super(username ? `Username '${username}' already exists` : 'Username already exists');
    }
}
