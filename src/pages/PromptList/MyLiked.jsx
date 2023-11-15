import { Grid } from '@mui/material';
import Categories from './Categories';
import TrendingAuthors from './TrendingAuthors';

export default function MyLiked () {
  return (
    <Grid container style={{ flexGrow: 1, width: '75%' }}>
      <Grid item xs={9}>
        My Liked
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          position: 'fixed',
          right: '1.5rem',
          height: '100vh',
          width: '18.5rem',
          paddingLeft: '1rem'
        }}
      >
        <Categories tagList={[]}/>
        <TrendingAuthors />
      </Grid>
    </Grid>
  )
}