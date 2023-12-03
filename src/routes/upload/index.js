const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/config.multer");

const router = express.Router();

router.post("/url", asyncHandler(uploadController.uploadImageFromUrl));
router.post(
  "/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadThumb),
);
router.post(
  "/image/s3",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageS3Client),
);

module.exports = router;
