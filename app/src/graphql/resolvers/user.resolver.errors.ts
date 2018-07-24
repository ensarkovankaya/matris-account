export class UserNotFound extends Error {
    public name = 'UserNotFound';

    constructor(by?: { id?: string, username?: string, email?: string }) {
        super();
        let message = 'User not found.';
        if (by.id) {
            message = `User not found with id '${by.id}'.`;
        } else if (by.email) {
            message = `User not found with email '${by.email}'.`;
        } else if (by.username) {
            message = `User not found with username '${by.username}'.`;
        }
        this.message = message;
    }
}

export class UserNotActive extends Error {
    public name = 'UserNotActive';

    constructor(by?: { id?: string, username?: string, email?: string }) {
        super();
        let message = 'User not active.';
        if (by.id) {
            message = `User with id '${by.id}' is not active.`;
        } else if (by.email) {
            message = `User with email '${by.email}' is not active.`;
        } else if (by.username) {
            message = `User with username '${by.username}' is not active.`;
        }
        this.message = message;
    }
}

export class EmailAlreadyExists extends Error {
    public name = 'EmailAlreadyExists';

    constructor(email?: string) {
        super(email ? `Mail '${email}' already exists.` : 'Mail already exists.');
    }
}

export class UserNameNotNormalized extends Error {
    public name = 'UserNameNotNormalized';
}

export class UserNameExists extends Error {
    public name = 'UserNameExists';

    constructor(username?: string) {
        super(username ? `Username '${username}' already exists.` : 'Username already exists.');
    }
}

export class ParameterRequired extends Error {
    public name = 'ParameterRequired';

    constructor(paramName: string) {
        super(`Parameter '${paramName}' required.`);
    }
}
