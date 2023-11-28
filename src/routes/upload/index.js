const express = require("express");
const { uploadImageFromUrl } = require("../../controllers/upload.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");

const router = express.Router();

// router.get('/url',asyncHandler(uploadImageFromUrl));
router.post("/url", asyncHandler(uploadController.uploadImageFromUrl));
router.post("/image/s3", asyncHandler(uploadController.uploadImageS3Client));

module.exports = router;
