import ProductList from '../components/ProductList';
import { Grid, Paper, Typography } from '@mui/material';

// Startsidan – visar produktlistan i ett kortlayout
function Home() {
  return (
    <Grid container spacing={8}>
      {/* Huvudsektion som tar upp full bredd på mobil och 9/12 på desktop */}
      <Grid component="section" item xs={12} md={9}>
        <Paper elevation={3} sx={{p: 2, mt: 4, borderRadius: 2}}>
        <ProductList />
        </Paper>
      </Grid>
      </Grid>
  )
};

export default Home;