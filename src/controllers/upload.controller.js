const { SuccessResponse } = require('../core/success.response')
const { uploadImageFromUrl } = require('../services/upload.service')


class UploadService {
    uploadImageFromUrl = async (req, res, next) => {
        new SuccessResponse({
            message: 'Upload from Url Success',
            metadata: await uploadImageFromUrl(req.body)
        }).send(res);
    }
}

module.exports = new UploadService();