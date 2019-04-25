const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("BUI HAI YEN"));

router.get("/dashboard", (req, res) => {
    res.render("index/welcome");
});

module.exports = router;