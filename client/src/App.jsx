import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button color="inherit" component={Link} to="/">
                Webbshop
              </Button>
            </Typography>
            <Button color="inherit" component={Link} to="/cart" sx={{ ml: 2 }}>
              Kundkorg
            </Button>
            <Button color="inherit" component={Link} to="/product/1" sx={{ ml: 2 }}>
              Produktdetaljer
            </Button>
            <Button color="inherit" component={Link} to="/product/1/edit" sx={{ ml: 2 }}>
              Ändra produkt
            </Button>
            <Button color="inherit" component={Link} to="/product/new" sx={{ ml: 2 }}>
              Lägg till produkt
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}

export default App;