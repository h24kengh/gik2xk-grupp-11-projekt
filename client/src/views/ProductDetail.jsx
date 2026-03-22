import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { getOne } from '../services/ProductService';
import { useEffect, useState } from 'react';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Inget produkt-ID angivet');
      setLoading(false);
      return;
    }

    setLoading(true);
    
    getOne(id)
      .then((data) => {
        if (data) {
          setProduct(data);
          setError(null);
        } else {
          setError('Produkten hittades inte');
        }
      })
      .catch((err) => {
        console.error('Fel vid hämtning:', err);
        setError('Kunde inte hämta produkten');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          {error || 'Produkten hittades inte'}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
          Produkt-id från URL: {id}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Tillbaka till produkter
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
      <Card sx={{ maxWidth: 1000, mx: 'auto', borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            component="img"
            src={product.image || 'https://via.placeholder.com/600x400?text=Ingen+bild'}
            alt={product.name}
            sx={{
              width: { xs: '100%', md: '50%' },
              height: { xs: 260, sm: 350, md: 'auto' },
              objectFit: 'cover',
              backgroundColor: '#f5f5f5',
            }}
          />

          <CardContent
            sx={{
              width: { xs: '100%', md: '50%' },
              p: { xs: 3, sm: 4 },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              {product.name}
            </Typography>

            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
              {product.price} kr
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              I lager: {product.stock} st
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => addToCart(product.id, 1, product.price)}
              sx={{ mt: 2 }}
            >
              Lägg i kundkorg
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Tillbaka till produkter
            </Button>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default ProductDetail;