const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk } = require("../../configs/config.multer");

const router = express.Router();

// router.get('/url',asyncHandler(uploadImageFromUrl));
router.post("/url", asyncHandler(uploadController.uploadImageFromUrl));
router.post(
  "/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadThumb),
);

module.exports = router;
