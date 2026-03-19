import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
} from '@mui/material';
import { useCart } from '../CartContext.jsx';
import { Link } from 'react-router-dom';

function ProductList() {
  const { addToCart } = useCart();

  const products = [
    { id: 1, name: 'Första produkten', price: 10.99, description: 'Detta är den första produkten.', stock: 5 },
    { id: 2, name: 'Andra produkten', price: 15.99, description: 'Detta är den andra produkten.', stock: 3 },
    { id: 3, name: 'Tredje produkten', price: 20.99, description: 'Detta är den tredje produkten.', stock: 7 },
  ];

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
                  variant="contained"
                  fullWidth
                  onClick={() => addToCart(product)}
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductList;