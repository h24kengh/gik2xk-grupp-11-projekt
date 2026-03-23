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
import placeholderImage from '../assets/hero.png';

function ProductList({pathname}) {

const [products, setProducts] = useState([]);

useEffect(() => {
  getAll()
    .then((data) => {
      // Kontrollera att data är en array innan du sätter den
      if (Array.isArray(data)) {
        
        setProducts(data);
      } else {
        console.error('Fick inte en array från getAll:', data);
        setProducts([]); // Sätt till tom array om datan inte är en array
      }
    })
    .catch((error) => {
      console.error('Kunde inte hämta produkter:', error);
      setProducts([]); // Sätt till tom array vid fel
    });
}, []);

  const { addToCart } = useCart();

  return (
    <Box>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.25rem' } }}
                >
                  {product.name}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.5,
                    fontSize: { xs: '1.6rem', sm: '1.25rem' },
                  }}
                >
                  {product.price} kr
                </Typography>

                <CardMedia
                  component="img"
                  sx={{ height: 200, objectFit: 'cover' }}
                  image={product.imageUrl || placeholderImage}
                  alt= {product.name}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: { xs: '1rem', sm: '0.95rem' } }}
                >
                  {product.description}
                </Typography>

                <Typography variant="body2" sx={{ fontSize: { xs: '1rem', sm: '0.95rem' } }}>
                  I lager: {product.stock}
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
                <Button
                  color="success"
                  variant="contained"
                  fullWidth
                  onClick={() => addToCart(product, 1, 1)}
                >
                  Lägg i kundkorg
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  to={`/product/${product.id}`}
                >
                  Visa produkt
                </Button>
                  <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/product/${product.id}/edit`}
                    sx={{ mt: 1 }}
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