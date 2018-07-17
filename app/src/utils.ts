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
    username = username.normalize().toLowerCase();

    // Replace Turkish characters
    username = username
        .replace(new RegExp('ğ', 'g'), 'g')
        .replace(new RegExp('Ğ', 'g'), 'g')
        .replace(new RegExp('ü', 'g'), 'u')
        .replace(new RegExp('Ü', 'g'), 'u')
        .replace(new RegExp('ç', 'g'), 'c')
        .replace(new RegExp('Ç', 'g'), 'c')
        .replace(new RegExp('ş', 'g'), 's')
        .replace(new RegExp('Ş', 'g'), 's')
        .replace(new RegExp('ı', 'g'), 'i')
        .replace(new RegExp('I', 'g'), 'i')
        .replace(new RegExp('ö', 'g'), 'o')
        .replace(new RegExp('Ö', 'g'), 'o');
    return username;
};

export const isDevelopment = (): boolean => {
    const env = process.env.NODE_ENV.toLowerCase();
    return env === 'dev' || env === 'development';
};
