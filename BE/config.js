module.exports = {
    allowedFrontendOrigin: 'http://localhost:4001',
    jwtConfig: {
        secret: 'viv99vfd9vdf09',
        algorithms: ['HS256']
    },
    passwordConfig: {
        salt: 'faacdcojirj90990',
        iterations: 1000,
        keylen: 64,
        digest: 'sha512',
    },
};