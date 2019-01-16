import Navigation from './navigation'
import Grid from '@material-ui/core/Grid';

export default ({ children,name,server }) => (
  <Grid container spacing={8} style={{ padding: 2 }}>
      <Navigation name={name} server={server} />
      { children }
  </Grid>
)