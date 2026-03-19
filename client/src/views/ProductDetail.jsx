import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: 'Första produkten',
      price: 10.99,
      description: 'Detta är den första produkten. Den passar perfekt för dig som vill ha en enkel och prisvärd produkt.',
      stock: 5,
      image: 'https://via.placeholder.com/600x400?text=Produkt+1',
    },
    {
      id: 2,
      name: 'Andra produkten',
      price: 15.99,
      description: 'Detta är den andra produkten. Ett bra val för dig som vill ha något lite bättre och mer användbart.',
      stock: 3,
      image: 'https://via.placeholder.com/600x400?text=Produkt+2',
    },
    {
      id: 3,
      name: 'Tredje produkten',
      price: 20.99,
      description: 'Detta är den tredje produkten. Ett premiumalternativ för dig som vill ha högre kvalitet.',
      stock: 7,
      image: 'https://via.placeholder.com/600x400?text=Produkt+3',
    },
  ];

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Produkten hittades inte.</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Produkt-id från URL: {id}
        </Typography>
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
            src={product.image}
            alt={product.name}
            sx={{
              width: { xs: '100%', md: '50%' },
              height: { xs: 260, sm: 350, md: 'auto' },
              objectFit: 'cover',
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

            <Typography variant="h5" sx={{ mb: 2 }}>
              {product.price} kr
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              I lager: {product.stock}
            </Typography>

            <Typography variant="body2" sx={{ mb: 3 }}>
              Produkt-id från URL: {id}
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => addToCart(product)}
            >
              Lägg i kundkorg
            </Button>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default ProductDetail;