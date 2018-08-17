/*configuring the tokens-generator lib*/
const TokenGenerator = require('token-generator')({
    salt: 'your secret recipe for this magic ingredient',
    timestampMap: 'zmxncbvlas'
});

const generateToken = () => {
    return TokenGenerator.generate();
}

/*checks the session token passed */
const validateToken = (token) => {
    return TokenGenerator.isValid(token) ? Promise.resolve(true) : Promise.resolve(false);
}

exports.validateToken = validateToken;
exports.generateToken = generateToken;