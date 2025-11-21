export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'default-secret-CHANGE-IN-PRODUCTION',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256'
};

export const hashRounds = 10;
