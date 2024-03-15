const express = require('express');
const router = express.Router();

const CryptoSHA = require("../controller/crypto.js")

//!   ---------Crypto RSA-SHA256 ROUTES---------

router.post("/createSecret", CryptoSHA.createPrivate);
router.post("/encryptData", CryptoSHA.encryptData);
router.post("/decryptData", CryptoSHA.decryptData);

//!   --------- NodeRSA ROUTES---------

router.post("/createRSASecret", CryptoSHA.createRSAPrivate);
router.post("/encryptRSAData", CryptoSHA.encryptRSAData);
router.post("/decryptRSAData", CryptoSHA.decryptRSAData);


module.exports = router;