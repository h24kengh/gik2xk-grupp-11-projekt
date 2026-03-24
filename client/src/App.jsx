import { Link, Outlet } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Container
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useCart } from './CartContext.jsx';

function App() {
  const { cartItems } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Räknar ut totalt antal produkter i kundkorgen
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Navigationslänkar som används i mobilmenyn
  const menuItems = [
    { text: `Kundkorg (${totalItems})`, path: '/cart' },
    { text: 'Produktdetaljer', path: '/product/1' },
    { text: 'Ändra produkt', path: '/product/1/edit' },
    { text: 'Lägg till produkt', path: '/product/new' },
  ];

  // Öppnar eller stänger mobilmenyn
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <Box component="header" sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logotyp/namn som länkar till startsidan */}
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                Webbshop
              </Button>
            </Typography>

            {/* Desktop-meny – visas endast på större skärmar */}
            <Box component="header"
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Button color="inherit" component={Link} to="/cart">
                Kundkorg ({totalItems})
              </Button>
              <Button color="inherit" component={Link} to="/product/new">
                Lägg till produkt
              </Button>
            </Box>

            {/* Hamburgerknapp – visas endast på mindre skärmar */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobil drawer – glider in från höger */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          {/* Stänger drawern vid klick eller tangenttryckning */}
          <Box component="header"
            sx={{ width: 260 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Meny
              </Typography>
            </Box>

            <Divider />

            <List>
              <ListItemButton component={Link} to="/">
                <ListItemText primary="Webbshop" />
              </ListItemButton>

              {/* Renderar alla menyalternativ dynamiskt */}
              {menuItems.map((item) => (
                <ListItemButton key={item.text} component={Link} to={item.path}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Huvudinnehåll – renderar aktuell sida via React Router */}
      <Container sx={{mt: 4 }} maxWidth="xl" component="main">
        <Outlet />
      </Container>
    </>
  );
}

export default App;