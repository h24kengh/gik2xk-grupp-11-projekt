import {
  Card,
  CardContent,
  CardActions,
  Typography,
  CardMedia,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { useCart } from '../CartContext.jsx';
import { Link } from 'react-router-dom';
import { getAll } from '../services/ProductService';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

// Importera dina bilder
import placeholderImage from '../assets/hero.png';
import laptop from '../assets/laptop.jpg';
import mus from '../assets/mus.jpg';
import skarm from '../assets/skarm.jpg';

function ProductList({ pathname }) {
  const [products, setProducts] = useState([]);

  // Koppla ID till importerad bildfil
  const imageMap = {
    1: laptop,
    2: mus,
    3: skarm,
  };

  useEffect(() => {
    getAll()
      .then((data) => {
        if (Array.isArray(data)) {
          // Berika produkterna med lokala bilder innan vi sätter state
          const enrichedProducts = data.map((product) => ({
            ...product,
            imageUrl: product.image ||imageMap[product.id] || placeholderImage,
          }));
          setProducts(enrichedProducts);
        } else {
          console.error('Fick inte en array från getAll:', data);
          setProducts([]);
        }
      })
      .catch((error) => {
        console.error('Kunde inte hämta produkter:', error);
        setProducts([]);
      });
  }, []); 

  const { addToCart } = useCart();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.25rem' }, fontWeight: 'bold' }}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    color: 'primary.main',
                    fontSize: { xs: '1.6rem', sm: '1.25rem' },
                  }}
                >
                  {product.price} kr
                </Typography>

                <CardMedia
                  component="img"
                  sx={{ 
                    height: 200, 
                    objectFit: 'contain', 
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}
                  image={product.imageUrl}
                  alt={product.name}
                />

                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  I lager: {product.stock} st
                </Typography>
              </CardContent>

              <CardActions
                sx={{
                  mt: 'auto',
                  p: 2,
                  pt: 0,
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {/* KNAPP 1: LÄGG I KUNDKORG */}
                <Button
                  color="success"
                  variant="contained"
                  fullWidth
                  onClick={() => addToCart(product)}
                >
                  Lägg i kundkorg
                </Button>

                {/* KNAPP 2: VISA PRODUKT */}
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to={`/product/${product.id}`}
                >
                  Visa produkt
                </Button>

                {/* KNAPP 3: ÄNDRA PRODUKT */}
                <Button
                  startIcon={<EditIcon />}
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/product/${product.id}/edit`}
                  color="warning"
                >
                  Ändra produkt
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductList;