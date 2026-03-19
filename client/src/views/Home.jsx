import PostList from '../components/ProductList';
import TagList from '../components/TagList';
import { Grid } from '@mui/material';

function Home() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <PostList />
      </Grid>

      <Grid item xs={12} md={3}>
        <TagList />
      </Grid>
    </Grid>
  );
}

export default Home;