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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useCart } from './CartContext.jsx';

function App() {
  const { cartItems } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    { text: `Kundkorg (${totalItems})`, path: '/cart' },
    { text: 'Produktdetaljer', path: '/product/1' },
    { text: 'Ändra produkt', path: '/product/1/edit' },
    { text: 'Lägg till produkt', path: '/product/new' },
  ];

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Vänster: logga / namn */}
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

            {/* Desktop-meny */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <Button color="inherit" component={Link} to="/cart">
                Kundkorg ({totalItems})
              </Button>
              <Button color="inherit" component={Link} to="/product/1">
                Produktdetaljer
              </Button>
              <Button color="inherit" component={Link} to="/product/1/edit">
                Ändra produkt
              </Button>
              <Button color="inherit" component={Link} to="/product/new">
                Lägg till produkt
              </Button>
            </Box>

            {/* Mobil-menyknapp */}
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

        {/* Mobil drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
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

              {menuItems.map((item) => (
                <ListItemButton key={item.text} component={Link} to={item.path}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      <Outlet />
    </>
  );
}

export default App;