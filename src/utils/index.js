'use strict';
const _ = require('lodash');
const crypto = require('crypto');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

const generateToken = () => crypto.randomBytes(64).toString('hex');

const getSelectData = (select) => {
    return Object.fromEntries(select.map((field) => [field, 1]));
};

const getUnSelectData = (select) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) {
            delete obj[key];
        }
    });

    return obj;
};

const updateNestedObjectParser = (obj) => {
    console.log(`[1]::`, obj);
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (typeof obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach((a) => {
                final[`${k}.${a}`] = response[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    console.log(`[2]::`, final);
    return final;
};

module.exports = {
    getInfoData,
    generateToken,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
};
