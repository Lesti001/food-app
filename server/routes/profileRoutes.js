const express = require('express');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { getProfile, updateProfile } = require('../controllers/profileController');

const router = express.Router();

router.use(authMiddleware);
router.get('/', asyncHandler(getProfile));
router.put('/', asyncHandler(updateProfile));

module.exports = router;
