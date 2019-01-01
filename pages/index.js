import React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LockIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import fetch from 'isomorphic-unfetch';
import Snackbar from '@material-ui/core/Snackbar';
import Router from 'next/router';

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 30, alignItems: 'center', width: 450, display: 'flex', flexDirection: 'column'
    },
    divStyle: {
        paddingLeft: 130, display: 'flex', flexDirection: 'row'
    }
}

export default class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        server: '',
        userName: '',
        password: "",
        remember: false,
        errorMsg: "",
        redirectToReferrer: false,
        isTip:false
    };

    handleServerMgr = () => {
        Router.push("/servermgr");
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () => {
        this.setState({ isTip: false });
    };

    login = event => {
        let _this = this;
        let url = "http://" + this.state.server + "/auth"
        let data = "name=" + this.state.userName + "&password=" + this.state.password;
        fetch(url, {
            'method': 'POST',
            'mode': 'cors',
            'headers': new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            'body': data
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            if (json.success) {
              sessionStorage.setItem("user", json.token);
              Router.push("/main");
            } else {
                _this.setState({ errorMsg: json.message, isTip:true})
            }
        }).catch(function (e) {
            console.log(e);
        });
    }

    render() {
       
        return (
            <Grid container spacing={24} style={{ paddingTop: 100 }}>
                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <Avatar style={{ backgroundColor: "#E10050" }}>
                            <LockIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" style={{ padding: 10 }}>
                            登录服务
                        </Typography>
                        <form style={{ paddingTop: 50 }} >
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="server">服务器地址</InputLabel>
                                <Select id="server" name="server" onChange={this.handleChange} value={this.state.server}>
                                    <MenuItem value="182.61.11.222:8080">182.61.11.222</MenuItem>
                                    <MenuItem value="localhost:8080">127.0.0.1</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="userName">用户名</InputLabel>
                                <Input id="userName" name="userName" onChange={this.handleChange} value={this.state.userName} />
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="password">密码</InputLabel>
                                <Input name="password" onChange={this.handleChange} value={this.state.password} type="password" id="password" />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="记住服务器/用户名"
                            />
                            <div style={classes.divStyle}>
                                <Button variant="contained" component="span" type="button" onClick={this.login} color="primary" style={{ margin: 5 }}>登录服务</Button>
                                <Button variant="contained" component="span" type="button" onClick={this.handleServerMgr} style={{ margin: 5 }}>配置服务</Button>
                            </div>
                        </form>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center'  }}
                            open={this.state.isTip}
                            onClose={this.handleClose}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id">{this.state.errorMsg}</span>}
                        />
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
