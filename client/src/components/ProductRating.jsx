import { useState, useEffect } from 'react';
import { Box, Rating, Typography, Alert } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function ProductRating({ productId, userId, onRatingChange }) {
  const [rating, setRating] = useState(0);           // Användarens valda betyg (interaktivt)
  const [averageRating, setAverageRating] = useState(0); // Snittbetyg från alla användare
  const [totalRatings, setTotalRatings] = useState(0);   // Antal betyg totalt
  const [loading, setLoading] = useState(false);     // Förhindrar dubbelklick under sparning
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null); // Användarens senast sparade betyg

  useEffect(() => {
    fetchRatings();
  }, [productId]); // Hämtar om betyg när produkten byts

  // Hämtar betygsdata från API:et och sätter state
  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings`);
      const data = await response.json();
      
      setAverageRating(data.averageRating);
      setTotalRatings(data.totalRatings);
      
      // Om användaren är inloggad, visa deras tidigare betyg
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
    // MUI skickar null om användaren klickar på samma stjärna igen – behåll då nuvarande betyg
    const valueInt = newValue === null ? rating : parseInt(newValue, 10);

    if (!valueInt || valueInt < 1 || valueInt > 5) {
      setError('Ogiltigt betyg');
      return;
    }

    setRating(valueInt);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: valueInt })
      });

      const text = await response.text();

      if (!response.ok) throw new Error(text);

      // Uppdatera snittbetyg efter lyckad sparning
      await fetchRatings();
      setUserRating(valueInt);
      if (onRatingChange) onRatingChange();

    } catch (err) {
      setError('Kunde inte spara betyg');
      setRating(userRating); // Återställ till senast sparade betyg vid fel
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
      
      {/* Visar genomsnittsbetyget (skrivskyddat) */}
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
      
      {/* Interaktiv betygsättning för inloggad användare */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {userRating ? 'Ändra ditt betyg:' : 'Betygsätt denna produkt:'}
        </Typography>
        <Rating
          value={rating}
          onChange={handleRatingChange}
          disabled={loading} // Inaktiveras under API-anrop
          size="large"
        />
      </Box>
    </Box>
  );
}

export default ProductRating;