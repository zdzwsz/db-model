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
import Router from 'next/router';



export default class navigation extends React.Component {
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

    render() {
        return (
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
        )
    }
}