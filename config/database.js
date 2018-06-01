module.exports = {
	stores: {
		mongo: {
			connection: { uri: 'mongodb://localhost/bunkey-administration' },
    },
	},
	storeDefault: 'mongo',
};
