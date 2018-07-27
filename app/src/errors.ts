export class UserNotFound extends Error {
    public name = 'UserNotFound';
    public message = 'UserNotFound';
}

export class UserNotActive extends Error {
    public name = 'UserNotActive';
    public message = 'UserNotActive';
}

export class EmailAlreadyExists extends Error {
    public name = 'EmailAlreadyExists';
    public message = 'EmailAlreadyExists';
}

export class UserNameNotNormalized extends Error {
    public name = 'UserNameNotNormalized';
    public message = 'UserNameNotNormalized';
}

export class UserNameExists extends Error {
    public name = 'UserNameExists';
    public message = 'UserNameExists';
}

export class ParameterRequired extends Error {
    public name = 'ParameterRequired';
    public message = 'ParameterRequired';
}

export class PasswordRequired extends Error {
    public name = 'PasswordRequired';
    public message = 'PasswordRequired';
}

export class RoleRequired extends Error {
    public name = 'RoleRequired';
    public message = 'RoleRequired';
}

export class EmailRequired extends Error {
    public name = 'EmailRequired';
    public message = 'EmailRequired';
}

export class FirstNameRequired extends Error {
    public name = 'FirstNameRequired';
    public message = 'FirstNameRequired';
}

export class LastNameRequired extends Error {
    public name = 'LastNameRequired';
    public message = 'LastNameRequired';
}

export class UserNameRequired extends Error {
    public name = 'UserNameRequired';
    public message = 'User must have valid username.';
}

export class InvalidID extends Error {
    public name = 'InvalidID';
    public message = 'InvalidID';
}

export class NothingToUpdate extends Error {
    public name = 'NothingToUpdate';
    public message = 'NothingToUpdate';
}
