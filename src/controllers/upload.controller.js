const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocalS3,
} = require("../services/upload.service");

class UploadService {
  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload from Url Success",
      metadata: await uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadImageS3Client = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File missing!!");

    new SuccessResponse({
      message: "Upload Image using S3Clienet!!",
      metadata: await uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadService();

