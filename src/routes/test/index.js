const express = require("express");

const router = express.Router();

router.get("/api", (req, res) => {
  return res.status(200).json({ code: 200, msg: "Test api successful!!" });
});

module.exports = router;
