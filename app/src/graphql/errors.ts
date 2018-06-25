export class UserNotFound extends Error {
    public name = 'UserNotFound';

    constructor() {
        super('UserNotFound');
    }
}

export class EmailAlreadyExists extends Error {
    public name = 'EmailAlreadyExists';

    constructor() {
        super('EmailAlreadyExists');
    }
}

export class UserNameExists extends Error {
    public name = 'UserNameExists';

    constructor() {
        super('UserNameExists');
    }
}
