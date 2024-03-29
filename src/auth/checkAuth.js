const { findByKey } = require('../services/apiKey.service');

const HEADERS = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADERS.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error',
            });
        }

        const objKey = await findByKey(key);
        if (!objKey) {
            console.log(1111);
            return res.status(403).json({
                mesasge: 'Forbidden Error',
            });
        }
        console.log(2222);

        req.objKey = objKey;

        next();
    } catch (error) {
        next(error);
    }
};

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied!',
            });
        }

        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({ message: 'Permissions Denied!' });
        }

        next();
    };
};

module.exports = {
    apiKey,
    permission,
};
