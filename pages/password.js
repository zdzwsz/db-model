import React from 'react';
import Layout from './layout';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';
import Avatar from '@material-ui/core/Avatar';
import { Modal, ModalTag } from '../component/Modal';
import AppStore from '../util/AppStore';
import Divider from '@material-ui/core/Divider';

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 20, alignItems: 'center', width: 650, display: 'flex', flexDirection: 'column'
    }
}

export default class navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            metaNPwd : "",
            metaNPwd1 : "",
            metaOPwd : "",
            userNPwd : "",
            userNPwd1 : "",
            userOPwd : ""
        };
        this.modal = Modal.createModal(this);
    }

    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    };

    changeMetaPassword() {
        if (this.state.metaNPwd || this.state.metaNPwd1 || this.state.metaOPwd) {
            if (this.state.metaNPwd != this.state.metaNPwd) {
                this.modal.alert("两次输入的新密码不相同，请重新输入！");
                return;
            }else{
                let data = { meta: { oldPassword: this.state.metaOPwd, newPassword: this.state.metaNPwd } }
                this.subitData(data);
            }
        } else {
            this.modal.alert("请输入管理用户旧密码和新密码！");
        }
    }

    subitData(data){
        let _this = this;
        AppStore.modifyPwd(data).then(function(json){
            if (json && json.json && json.json.code === "000") {
                _this.modal.tip("修改成功");
                _this.setState({
                    metaNPwd : "",
                    metaNPwd1 : "",
                    metaOPwd : "",
                    userNPwd : "",
                    userNPwd1 : "",
                    userOPwd : ""
                })
    
            }else if(json && json.json){
                _this.modal.tip("修改失败:"+json.json.message);
            }else{
                _this.modal.tip("修改失败:未知错误！");
            }
        })
    }

    changeUserPassword() {
        if (this.state.userNPwd || this.state.userNPwd1 || this.state.userOPwd) {
            if (this.state.userNPwd != this.state.userNPwd) {
                this.modal.alert("两次输入的新密码不相同，请重新输入！");
                return;
            }else{
                let data = { user: { oldPassword: this.state.userOPwd, newPassword: this.state.userNPwd } }
                this.subitData(data);
            }
        } else {
            this.modal.alert("请输入数据访问用户旧密码和新密码！");
        }
    }

    render() {
        return (
            <Layout>
                <Grid container spacing={24} style={{ paddingTop: 45 }}>
                    <Grid item xs={12} style={classes.GridStyle}>
                        <Paper style={classes.PaperStyle}>
                            <Avatar style={{ backgroundColor: "#E10050" }}>
                                <LockIcon />
                            </Avatar>
                            <Typography component="h5" variant="h6" style={{ padding: 2 }}>
                                修改管理用户密码
                        </Typography>
                            <TextField value={this.state.metaOPwd} key="metaOPwd" name="metaOPwd" onChange={this.handleChange} label="输入旧管理密码" type="password" margin="normal"  style={{ margin: 4, width: 350 }} />
                            <TextField value={this.state.metaNPwd} key="metaNPwd" name="metaNPwd" onChange={this.handleChange} label="输入新管理密码" type="password" margin="normal"  style={{ margin: 4, width: 350 }} />
                            <TextField value={this.state.metaNPwd1} key="metaNPwd1" name="metaNPwd1" onChange={this.handleChange} label="重复新管理密码" type="password" margin="normal"  style={{ margin: 4, width: 350 }} />
                            <br />
                            <Button variant="contained" color="primary" onClick={this.changeMetaPassword.bind(this)}> 修改管理密码 </Button>
                            <br/>
                            <Divider width={500} />
                            <Typography component="h5" variant="h6" style={{ padding: 2 }}>
                                修改数据访问用户密码
                        </Typography>
                            <TextField value={this.state.userOPwd} key="userOPwd" name="userOPwd" onChange={this.handleChange} label="输入旧用户密码" type="password" margin="normal"  style={{ margin: 4, width: 350 }} />
                            <TextField value={this.state.userNPwd} key="userNPwd" name="userNPwd" onChange={this.handleChange} label="输入新用户密码" type="password" margin="normal"  style={{ margin: 4, width: 350 }} />
                            <TextField value={this.state.userNPwd1} key="userNPwd1" name="userNPwd1" onChange={this.handleChange} label="重复新用户密码" type="password" margin="normal" style={{ margin: 4, width: 350 }} />
                            <br />
                            <Button variant="contained" color="primary" onClick={this.changeUserPassword.bind(this)}> 修改数据密码 </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <ModalTag config={this.modal.getConfig()} />
            </Layout>
        )
    }
}