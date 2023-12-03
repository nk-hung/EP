const multer = require("multer");

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "assets/upload");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

module.exports = {
  uploadDisk,
  uploadMemory,
};
