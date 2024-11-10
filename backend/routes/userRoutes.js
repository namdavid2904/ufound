const express = require('express');
const { googleLogin, googleOAuthCallback } = require('../controller/userController');
const router = express.Router();

router.post("/login", googleLogin);
router.get("/auth/google/callback", googleOAuthCallback);

module.exports = router;