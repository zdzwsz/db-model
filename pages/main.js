import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/AddCircle';
import Divider from '@material-ui/core/Divider';
import Layout from './layout';
import Category from '../component/Category';

const classes = {
    chipClass: {
        margin: 4
    },
    CardClass: {
        margin: 8,
        width: 420
    },
    GriditemClass: {
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        display: 'flex',
        flexDirection: 'row'
    }
}

export default class main extends React.Component {
    constructor(props) {
        super(props);
    }

    handleDelete() {
        alert('You clicked the delete icon.');
    }

    handleClick() {
        alert('You clicked the Chip.');
    }

    render() {
        return (
            <Layout>
                <Grid item xs={12} style={classes.GriditemClass}>
                    <Card style={classes.CardClass}>
                        <CardContent>
                            <Category label="petshop" />
                            <Divider />
                            <Typography color="textSecondary">服务实体：</Typography>
                            <Chip label="新增实体" style={classes.chipClass} onDelete={this.handleDelete}
                                deleteIcon={<AddIcon />} />
                            <Chip label="pet:宠物" onClick={this.handleClick} style={classes.chipClass} onDelete={this.handleDelete} />
                            <Chip label="shopcar:购物车" onClick={this.handleClick} style={classes.chipClass} onDelete={this.handleDelete} />
                            <Divider />
                            <Typography color="textSecondary">服务 API：</Typography>
                            <Chip label="新增 API" style={classes.chipClass} onDelete={this.handleDelete}
                                deleteIcon={<AddIcon />} />
                            <Chip label="add:增加商品" style={classes.chipClass} onDelete={this.handleDelete} />
                            <Chip label="total:统计商品" style={classes.chipClass} onDelete={this.handleDelete} />
                            <Chip label="get:读取购物车" style={classes.chipClass} onDelete={this.handleDelete} />
                        </CardContent>
                    </Card>
                    <Card style={classes.CardClass}>
                        <CardContent>
                            <Category />
                            <Divider />
                            <Typography color="textSecondary">服务实体：</Typography>
                            <Chip label="新增实体" style={classes.chipClass} onDelete={this.handleDelete}
                                deleteIcon={<AddIcon />} />
                            <Divider />
                            <Typography color="textSecondary">服务 API：</Typography>
                            <Chip label="新增 API" style={classes.chipClass} onDelete={this.handleDelete}
                                deleteIcon={<AddIcon />} />
                        </CardContent>
                    </Card>

                </Grid>
            </Layout>
        )
    }
}