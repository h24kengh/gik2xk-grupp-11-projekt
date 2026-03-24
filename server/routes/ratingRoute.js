const express = require('express');
const router = express.Router();
const ratingService = require('../services/RatingService');

// Lägger till eller uppdaterar ett betyg för en specifik produkt
router.post('/products/:productId/ratings', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, value } = req.body;

    console.log("===== NY REQUEST =====");
    console.log("Params (productId):", productId);
    console.log("Body:", req.body);
    
    // Validerar att betyget är ett heltal mellan 1 och 5
    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Ogiltigt betyg' });
    }
    
    const rating = await ratingService.addOrUpdateRating(userId, productId, value);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hämtar alla betyg för en specifik produkt
router.get('/products/:productId/ratings', async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await ratingService.getProductRatings(productId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;