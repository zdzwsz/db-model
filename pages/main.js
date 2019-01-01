import React from 'react';
import Grid from '@material-ui/core/Grid';

export default class main extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Grid container spacing={8} style={{ padding: 10 }}>
               <Grid item xs={12} >head</Grid>
               <Grid item xs={2} >kkk</Grid>
               <Grid item xs={10} >lll</Grid>
            </Grid>
        )
    }
}