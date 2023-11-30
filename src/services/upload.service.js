const cloudinary = require("../configs/cloudinary.config");
const { s3, PutObjectCommand } = require("../configs/aws.config.js");
const { BadRequestError } = require("../core/error.response.js");
// UPLOAD S3 ///

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomName = crypto.randomBytes(16).toString("hex");
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "image/png",
      Body: file.buffer,
      Key: randomName,
    });

    const result = await s3.send(command);
  } catch (error) {
    console.error("Error when upload S3:::", error);
  }
};
// END /////////

// 1. Upload image from url
const uploadImageFromUrl = async () => {
  try {
    const imageUrl =
      "https://down-vn.img.susercontent.com/file/vn-50009109-439a7dda1c050473da2dfa41338a27f5";
    const folder = "products/image";
    const res = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
    });
    return res;
  } catch (error) {
    console.error("Error upload image url", error);
  }
};

// 2. Upload image from local
const uploadImageFromLocal = async ({
  path,
  folderName = "product/upload",
}) => {
  try {
    const res = await cloudinary.uploader.upload(path, {
      folder: folderName,
    });
    console.log("upload local:::", res);
    return res;
  } catch (error) {
    console.error("Error upload image from local:::", error);
  }
};

// 3. Upload multi image
const uploadMulti = async(files);
module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
};
