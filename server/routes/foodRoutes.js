const express = require('express');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const {
  searchFoods,
  listPrivateFoods,
  createPrivateFood,
  deletePrivateFood,
} = require('../controllers/foodController');

const router = express.Router();

router.use(authMiddleware);
router.get('/search', asyncHandler(searchFoods));
router.get('/private', asyncHandler(listPrivateFoods));
router.post('/private', asyncHandler(createPrivateFood));
router.delete('/private/:id', asyncHandler(deletePrivateFood));

module.exports = router;
