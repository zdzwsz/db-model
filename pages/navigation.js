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
        this.state = {
            user: { name: "",server:"" }
        }
        this.state.init = props.init;
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

    handleMain = () => {
        Router.push("/main");
    };

    handlePassword = () => {
        Router.push("/password");
    };

    render() {
        let statButton = "";
        let modifyPassword = "";
        if(!this.state.init){
            statButton = ( 
            <Button color="inherit" onClick={this.handleMain}>首页</Button>
            );
            modifyPassword = ( 
                <Button color="inherit" onClick={this.handlePassword}>修改密码</Button>
            );
        }
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
                            {statButton}
                            {modifyPassword}
                            <Button onClick={this.handleLogout} color="inherit">登出系统</Button>
                            <IconButton aria-haspopup="true" color="inherit">
                                <AccountCircle />
                            </IconButton>
                            <Typography variant="h6" color="inherit" >
                                {this.state.user.name} ( {this.state.user.server} )
                            </Typography>
                           
                        </Toolbar>
                    </AppBar>
                </Grid>  
        )
    }
}