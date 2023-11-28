import { Grid } from '@mui/material';
import Categories from '@/components/Categories';
import RightPanel from '@/components/RightPanel';
import TrendingAuthors from './TrendingAuthors';

export default function Latest () {
  return (
    <Grid container style={{ flexGrow: 1, width: '75%' }}>
      <Grid item xs={9}>
      Latest
      </Grid>
      
      <RightPanel>
        <Categories tagList={[]}/>
        <TrendingAuthors />
      </RightPanel>
    </Grid>
  )
}