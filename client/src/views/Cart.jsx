import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Cart() {
  // Hämtar kundvagnsdata och funktioner från context
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalPrice,
  } = useCart();

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Kundkorg
      </Typography>

      {/* Visar tomt-meddelande om kundkorgen är tom, annars listas produkterna */}
      {cartItems.length === 0 ? (
        <>
        <Typography>Din kundkorg är tom.</Typography>

        <Button
  startIcon={<ShoppingCartIcon />}
  variant="contained"
  color="success"
  component={Link}
  to="/"
  size="large"
  sx={{ mt: 2 }}
>
  Börja handla
</Button>
</>
        
      ) : (
        <>
          <Stack spacing={2}>
            {/* Loopar igenom varje produkt i kundkorgen */}
            {cartItems.map((item, index) => (
              <Card key={item.id || index}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {item.name}
                  </Typography>

                  <Typography>Pris: {item.price} kr</Typography>
                  <Typography>Antal: {item.quantity}</Typography>
                  {/* Räknar ut delsumma för denna produkt */}
                  <Typography sx={{ mb: 2 }}>
                    Summa: {(Number(item.price) * Number(item.quantity)).toFixed(2)} kr
                  </Typography>

                  {/* Knappar för att ändra antal eller ta bort produkten */}
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => decreaseQuantity(item.id)}
                      fullWidth
                    >
                      -
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => increaseQuantity(item.id)}
                      fullWidth
                    >
                      +
                    </Button>

                    <Button
                      startIcon={<DeleteIcon/>}
                      variant="contained"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      fullWidth
                    >
                      Ta bort
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Visar totalpriset för alla produkter i kundkorgen */}
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Totalt: {totalPrice.toFixed(2)} kr
          </Typography>

          {/* Knappar för att tömma kundkorgen eller fortsätta handla */}
          <Stack  direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button startIcon={<DeleteIcon/>} variant="contained" color="error" onClick={clearCart} fullWidth>
              Töm kundkorg
            </Button>

            <Button startIcon={<ChevronLeftIcon/>} color="success" variant="contained" component={Link} to="/" fullWidth>
              Fortsätt handla
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

export default Cart;