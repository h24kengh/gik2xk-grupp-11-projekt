import { Typography, Box } from '@mui/material';
import ProductList from '../components/ProductList';
import { useParams, useLocation } from 'react-router-dom';

function Products() {
  const location = useLocation(); // Ger tillgång till aktuell URL och eventuell state

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 'bold',
          fontSize: { xs: '2rem', sm: '2.5rem' },
        }}
      >
        Produkter
      </Typography>

      {/* Renderar listan med alla produkter */}
      <ProductList />
    </Box>
  );
}

export default Products;