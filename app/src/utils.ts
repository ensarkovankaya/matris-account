export const generateRandomUsername = (length: number): string => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let username = '';
    for (let i = 0; i < length; i++) {
        const num = Math.floor(Math.random() * chars.length);
        username += chars.substring(num, num + 1);
    }
    return username;
};

export const normalizeUsername = (username: string) => {
    // Remove empty spaces
    username = username.replace(/\s/g, '');

    // Lowercase
    username = username.normalize().toLocaleLowerCase();

    // Replace Turkish characters
    username = username
        .replace('ğ', 'g')
        .replace('ü', 'u')
        .replace('ç', 'c')
        .replace('ş', 's')
        .replace('ı', 'i')
        .replace('ö', 'o');
    return username;
};

export const isTest = (): boolean => process.env.NODE_ENV.toLowerCase() === 'test';

export const isDevelopment = (): boolean => {
    const env = process.env.NODE_ENV.toLowerCase();
    return env === 'dev' || env === 'development';
};
