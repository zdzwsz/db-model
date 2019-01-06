import Navigation from './navigation'
import Grid from '@material-ui/core/Grid';

export default ({ children }) => (
  <Grid container spacing={8} style={{ padding: 2 }}>
      <Navigation />
      { children }
  </Grid>
)