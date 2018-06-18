const keygen = key => process.env[key];

module.exports = {
    [keygen('USER_APIKEY')]: 'user',
    [keygen('API_GATEWAY_APIKEY')]: 'apiGateway',
};
