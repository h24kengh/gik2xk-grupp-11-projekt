import { useState, useEffect } from 'react';
import { Box, Rating, Typography, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function ProductRating({ productId, userId, onRatingChange }) {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, [productId]);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/ratings`);
      const data = await response.json();
      
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
      
      if (userId) {
        const userExistingRating = data.ratings.find(r => r.user_id === userId);
        if (userExistingRating) {
          setUserRating(userExistingRating.value);
          setRating(userExistingRating.value);
        }
      }
    } catch (err) {
      setError('Kunde inte ladda betyg');
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!userId) {
      setError('Du måste vara inloggad för att betygsätta');
      return;
    }
    
    setRating(newValue);
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, value: newValue })
      });
      
      if (response.ok) {
        await fetchRatings();
        setUserRating(newValue);
        if (onRatingChange) onRatingChange();
      } else {
        throw new Error('Kunde inte spara');
      }
    } catch (err) {
      setError('Kunde inte spara betyg');
      setRating(userRating);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Betyg och recensioner
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Rating
          value={averageRating}
          precision={0.5}
          readOnly
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          sx={{ mr: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {averageRating} av 5 ({totalRatings} betyg)
        </Typography>
      </Box>
      
      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {userRating ? 'Ändra ditt betyg:' : 'Betygsätt denna produkt:'}
        </Typography>
        <Rating
          value={rating}
          onChange={handleRatingChange}
          disabled={loading}
          size="large"
        />
      </Box>
    </Box>
  );
}

export default ProductRating;