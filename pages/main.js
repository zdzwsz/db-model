import React from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
let sessionStorage = require("../util/Storage").sessionStorage();
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/AddCircle';
import StorageIcon from '@material-ui/icons/Storage';
import Divider from '@material-ui/core/Divider';

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

    state = {
        user: { name: "" }
    }

    componentWillMount() {
        let str = sessionStorage.getItem("user");
        if (str != null) {
            let user = JSON.parse(str);
            this.setState({ user: user });
        }
    }

    handleLogout = () => {
        Router.push("/");
    };

    handleDelete() {
        alert('You clicked the delete icon.');
    }

    handleClick() {
        alert('You clicked the Chip.'); 
    }

    render() {
        return (
            <Grid container spacing={8} style={{ padding: 10 }}>
                <Grid item xs={12} >
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton color="inherit" aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                                数据服务建模
                            </Typography>
                            <Button color="inherit">服务统计</Button>
                            <Button color="inherit">修改密码</Button>
                            <Button onClick={this.handleLogout} color="inherit">登出系统</Button>
                            <IconButton aria-haspopup="true" color="inherit">
                                <AccountCircle />
                            </IconButton>
                            <Typography variant="h6" color="inherit" >
                                {this.state.user.name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item xs={12} style={classes.GriditemClass}>
                    <Card style={classes.CardClass}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                            <Chip icon={<StorageIcon />} label="petshop"  color="primary" variant="outlined" style={classes.chipClass} onDelete={this.handleDelete}/>
                            </Typography>
                            <Divider/>
                            <Typography component="p">
                                 实体<br/>
                                <Chip label="pet:宠物" onClick={this.handleClick} style={classes.chipClass} onDelete={this.handleDelete} />
                                <Chip label="shopcar:购物车" onClick={this.handleClick} style={classes.chipClass} onDelete={this.handleDelete} />
                                <Chip label="新增实体"  style={classes.chipClass} onDelete={this.handleDelete}
                                    deleteIcon={<AddIcon />} />
                            </Typography>
                            <Typography component="p">
                                API<br/>
                                <Chip label="add:增加商品" style={classes.chipClass} onDelete={this.handleDelete} />
                                <Chip label="total:统计商品" style={classes.chipClass} onDelete={this.handleDelete} />
                                <Chip label="get:读取购物车" style={classes.chipClass} onDelete={this.handleDelete} />
                                <Chip label="新增 API" style={classes.chipClass} onDelete={this.handleDelete}
                                    deleteIcon={<AddIcon />} />
                            </Typography>
                        </CardContent>

                    </Card>
                    <Card style={classes.CardClass}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                <Chip label="新增服务 " variant="outlined" color="primary" style={classes.chipClass} onDelete={this.handleDelete}
                                    deleteIcon={<AddIcon />} />
                            </Typography>
                            <Divider/>
                            <Typography component="p">
                            实体<br/>
                                <Chip label="新增实体" style={classes.chipClass} onDelete={this.handleDelete}
                                    deleteIcon={<AddIcon />} />
                            </Typography>
                            <Typography component="p">
                            API<br/>
                                <Chip label="新增 API" style={classes.chipClass} onDelete={this.handleDelete}
                                    deleteIcon={<AddIcon />} />
                            </Typography>
                        </CardContent>

                    </Card>
                </Grid>
                <Grid item xs={12} ></Grid>
            </Grid>
        )
    }
}