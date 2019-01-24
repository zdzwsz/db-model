import Navigation from './navigation'
import Grid from '@material-ui/core/Grid';

export default ({ children,init }) => (
  <Grid container spacing={8} style={{ padding: 2 }}>
      <Navigation init={init} />
      { children }
  </Grid>
)