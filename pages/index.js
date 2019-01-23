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
import { encryptionParameter } from "../util/UserUtil";

let localStorage = require("../util/Storage").localStorage();

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 30, alignItems: 'center', width: 450, display: 'flex', flexDirection: 'column'
    },
    divStyle: {
        paddingLeft: 110, display: 'flex', flexDirection: 'row'
    }
}

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            server: '',
            userName: '',
            password: "",
            remember: false,
            errorMsg: "",
            redirectToReferrer: false,
            isTip: false,
            servers: [],
            autoFocus:false
        };
        this.remember = this.remember.bind(this);
    }

    handleServerMgr = () => {
        Router.push("/servermgr");
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    handleClose = () => {
        this.setState({ isTip: false });
    };

    init() {
        let jsonString = localStorage.getItem("servers");
        let jsonObjects = []
        if (jsonString) {
            jsonObjects = JSON.parse(jsonString);
        }
        if (Array.isArray(jsonObjects)) {
            this.state.servers=jsonObjects;
        }
        let _this = this;
        this.setState({ isTip: false });
        setTimeout(() => {
            _this.remember();
        }, 100);
    }

    remember(){
        let rememberString = localStorage.getItem("remember");
        if (rememberString) {
            let rememberObjects = JSON.parse(rememberString);
            this.state.remember = true;
            this.state.userName = rememberObjects.name;
            this.state.server = rememberObjects.server;
            this.state.autoFocus = true;
        }
        this.setState({ isTip: false });
    }

    componentWillMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        this.init();
    }

    login = event => {
        let _this = this;
        let host = "http://" + this.state.server;
        let url = host + "/metaAuth"
        if (this.state.server == "") {
            this.setState({ errorMsg: "请选择服务器/或者配置服务器", isTip: true })
            return;
        }
        if (this.state.userName == "") {
            this.setState({ errorMsg: "请输入用户名", isTip: true })
            return;
        }
        if (this.state.password == "") {
            this.setState({ errorMsg: "请输入密码", isTip: true })
            return;
        }
        let data = "name=" + this.state.userName + "&password=" + this.state.password;

        fetch(url, {
            'method': 'POST',
            'mode': 'cors',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                "x-access-token": "start"
            },
            'body': data
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            if (json.success) {
                let serverinfo = _this.getServerName(_this.state.server);
                sessionStorage.setItem("user", JSON.stringify({ name: _this.state.userName,server:serverinfo.name }));
                let parameter = encryptionParameter(host, json.token);
                document.cookie = "parameter=" + parameter;
                //console.log(_this.state.remember);
                if (_this.state.remember == true) {
                    localStorage.setItem("remember", JSON.stringify({ name: _this.state.userName, server: _this.state.server }))
                } else {
                    localStorage.removeItem("remember");
                }
                let message = json.message;
                if(message == "init"){
                    Router.push({pathname: "/setup",});
                }else{
                    Router.push({pathname: "/main",});
                }
               
            } else {
                let message = json.message;
                if(message == "init"){
                    message="服务器需要初始化，请使用superman登陆"
                }
                _this.setState({ errorMsg: message, isTip: true })
            }
        }).catch(function (e) {
            _this.setState({ errorMsg: "服务器访问错误，请检查服务地址配置或者服务未启动", isTip: true })
            console.log(e);
        });
    }

    getServerName(ip){
        let servers = this.state.servers;
       for(let i =0;i<servers.length;i++){
           if(servers[i].ip+":"+servers[i].port === ip){
               return servers[i];
           }
       }
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
                                    {this.state.servers.map(function (row, i) {
                                        let url = row.ip + ":" + row.port
                                        return (
                                            <MenuItem key={i} value={url}>{row.name}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="userName">用户名</InputLabel>
                                <Input id="userName" name="userName" onChange={this.handleChange} value={this.state.userName} />
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="password">密码</InputLabel>
                                <Input name="password" onChange={this.handleChange} autoFocus={this.state.autoFocus} value={this.state.password} type="password" id="password" />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox name="remember" checked={this.state.remember} onChange={this.handleChangeCheckbox} color="primary" />}
                                label="记住服务器/用户名"
                            />
                            <div style={classes.divStyle}>
                                <Button variant="contained" component="span" type="button" onClick={this.login} color="primary" style={{ margin: 5 }}>登录服务</Button>
                                <Button variant="contained" component="span" type="button" onClick={this.handleServerMgr} style={{ margin: 5 }}>配置服务</Button>
                            </div>
                        </form>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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


