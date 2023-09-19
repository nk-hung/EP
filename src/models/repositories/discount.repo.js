const { getUnSelectData, getSelectData } = require('../../utils');

const getAllDiscountCodesUnselect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model,
}) => {
    const skip = limit * (page - 1);
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    const documents = await model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getUnSelectData(unSelect))
        .lean();

    return documents;
};

const getAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    select,
    model,
}) => {
    const skip = limit * (page - 1);
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documents = await model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .select(getSelectData(select))
        .lean();
    return documents;
}

const checkDiscountExists = async (model, filter) => {
    return await model.findOne(filter).lean()
}
module.exports = {
    getAllDiscountCodesUnselect,
    getAllDiscountCodesSelect,
    checkDiscountExists
};
