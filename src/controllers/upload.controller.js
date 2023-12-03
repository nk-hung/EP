const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
} = require("../services/upload.service");

class UploadService {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload from Url Success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File Missing!");
    }
    new SuccessResponse({
      message: "Upload From Local Success",
      metadata: await uploadImageFromLocal({ path: file.path }),
    }).send(res);
  };

  uploadImageS3Client = async (req, res) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File Missing");

    new SuccessResponse({
      message: "Upload Image From S3 Success",
      metadata: await uploadImageFromLocalS3({ file }),
    }).send(res);
  };
}

module.exports = new UploadService();
