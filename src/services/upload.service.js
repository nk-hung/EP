const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/aws.config.js");
const { BadRequestError } = require("../core/error.response.js");
const { generateRandomName } = require("../utils/index.js");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const moment = require("moment");

const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomName = generateRandomName();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      ContentType: "image/jpeg",
      Body: file.buffer,
      Key: randomName,
    });
    const result = await s3.send(command);
    console.log("result::", result);

    const s3path = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: randomName,
    });
    // await getSignedUrl(s3, s3path, { expiresIn: 3600 });
    const signedUrl = getSignedUrl({
      url: `${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${randomName}`,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY,
      dateLessThan: moment().add(3, "days").format("YYYY-MM-DD"),
    });

    return {
      url: signedUrl,
      result,
    };
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
module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalS3,
};
