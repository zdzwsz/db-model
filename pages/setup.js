import React from 'react';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import Layout from './layout';
import { Modal, ModalTag } from '../component/Modal';
import AppStore from '../util/AppStore';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function getSteps() {
    return ['设置密码', '设置数据库', '设置文件目录', "重启服务"];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return '设置管理密码和数据访问密码';
        case 1:
            return '设置数据库';
        case 2:
            return '设置文件目录';
        default:
            return '重启服务，完成设置！';
    }
}

export default class setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
        };
        this.modal = Modal.createModal(this);
    }
    config = {
        username:"user",
        userpwd: "",
        userpwd1: "",
        metaname:"admin",
        metapwd: "",
        metapwd1: "",
        modules: "",
        dbtype: "mysql",
        host: "127.0.0.1",
        user: "root",
        password: "",
        password1: "",
        dbname: ""
    }
    detail = {
        username:"数据访问用户",
        userpwd: "数据访问用户密码",
        userpwd1: "数据访问用户密码",
        metaname:"管理用户",
        metapwd: "管理用户密码",
        metapwd1: "管理用户密码",
        modules: "文件目录",
        dbtype: "数据库类型",
        host: "数据库地址",
        user: "数据库用户",
        password: "数据库密码",
        password1: "数据库密码",
        dbname: "数据库名称"
    }
    isStepOptional = step => step === 1;
    isStepSkipped(step) {
        return this.state.skipped.has(step);
    }

    handleNext = () => {
        const { activeStep } = this.state;
        if(activeStep==0){
            if(this.config.userpwd !=this.config.userpwd1){
                this.modal.alert("输入的数据密码不相同，请重新输入");
                return;
            }else if(this.config.metapwd !=this.config.metapwd1){
                this.modal.alert("输入的管理密码不相同，请重新输入");
                return;
            }
        }
        if(activeStep==1){
            if(this.config.password !=this.config.password1){
                this.modal.alert("输入的数据库密码不相同，请重新输入");
                return;
            }
        }

        if(activeStep==3){
            let config = this.config;
            for( let key in config){
                if(config[key]==""){
                    this.modal.alert(this.detail[key]+"没有输入，请输入！");
                    return;
                }
            }
            let _this = this;
            this.modal.confirm("是否确定保存数据，并重启服务？").then(function(){
                let data ={
                    user:{
                        "name":config.username,
                        "password":config.userpwd
                    },
                    meta:{
                        "name":config.metaname,
                        "password":config.metapwd
                    },
                    modules: config.modules,
                    database:{
                        dbtype: config.dbtype,
                        host: config.host,
                        user: config.user,
                        password: config.password,
                        dbname: config.dbname
                    }
                }
                _this.modal.wait("正在保存数据，请等待......");
                AppStore.setupServer(data).then(function(json){
                    if (json && json.json && json.json.code === "000") {
                        _this.modal.tip("保存成功，重新登陆系统");
                        setTimeout(() => {
                            Router.push("/index");
                        }, 500);
                    }else{
                        _this.modal.tip("保存失败，请重新登陆再重试");
                        setTimeout(() => {
                            Router.push("/index");
                        }, 500);
                    }
                })
            });
            return;
        }

        this.setState({
            activeStep: activeStep + 1,
        });
    };



    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleChange = event  => {
        this.config[event.target.name]=event.target.value;
    };


    render() {
        const steps = getSteps();
        const { activeStep } = this.state;
        let _this = this;
        return (
            <Layout>
                <div style={{ width: '95%', display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: 20 }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const props = {};
                            const labelProps = {};
                            if (this.isStepOptional(index)) {
                                labelProps.optional = <Typography variant="caption">Optional</Typography>;
                            }
                           
                            return (
                                <Step key={label} {...props}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div style={{ width: '90%', margin: 20 }}>
                        <div>
                            <Typography style={{ margin: 10 }}>{getStepContent(activeStep)}</Typography>
                            {activeStep === 0 ? (<div style={{ height: 150 }}>
                                <TextField key="username" name="username" defaultValue={this.config.username} onChange={this.handleChange} label="输入管理用户"  margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                <TextField key="userpwd" name="userpwd" defaultValue={this.config.userpwd} onChange={this.handleChange} label="输入管理密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                <TextField key="userpwd1" name="userpwd1" defaultValue={this.config.userpwd1} onChange={this.handleChange} label="重复管理密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                <br></br>
                                <TextField key="metaname" name="metaname" defaultValue={this.config.metaname} onChange={this.handleChange} label="输入数据访问用户"  margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                <TextField key="metapwd" name="metapwd" defaultValue={this.config.metapwd} onChange={this.handleChange} label="输入数据密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                <TextField key="metapwd1" name="metapwd1" defaultValue={this.config.metapwd1} onChange={this.handleChange} label="重复数据密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                            </div>) :
                                activeStep === 1 ? (<div style={{ height: 150 }}>
                                    <TextField key="dbtype" name="dbtype" defaultValue={this.config.dbtype} onChange={this.handleChange} label="选择数据库类型" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                    <TextField key="host" name="host" defaultValue={this.config.host} onChange={this.handleChange} label="数据地址" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                    <TextField key="dbname" name="dbname" defaultValue={this.config.dbname} onChange={this.handleChange} label="数据库名" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                    <br />
                                    <TextField key="user" name="user" defaultValue={this.config.user} onChange={this.handleChange} label="数据库用户名"  margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                    <TextField key="password" name="password" defaultValue={this.config.password} onChange={this.handleChange} label="数据库密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />
                                    <TextField key="password1" name="password1" defaultValue={this.config.password1} onChange={this.handleChange} label="重复数据库密码" type="password" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} />

                                </div>) :
                                    activeStep === 2 ? (<div style={{ height: 150 }}>
                                        <TextField key="modules" name="modules" onChange={this.handleChange} defaultValue={this.config.modules} label="输入文件目录名" margin="normal" variant="outlined" style={{ margin: 4, width: 250 }} /><br />
                                        使用绝对路径，目录不存在，系统自动生成！
                             </div>) :
                                        (<div style={{ height: 150, padding: 10 }}>设置完成，系统自动重新启动，请重新登陆</div>)}
                            <div>
                                <Button disabled={activeStep === 0} onClick={this.handleBack}>上一步</Button>
                                <Button variant="contained" color="primary" onClick={this.handleNext.bind({activeStep})}>
                                    {activeStep === steps.length - 1 ? '完成' : '下一步'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalTag config={this.modal.getConfig()} />
            </Layout>
        )
    }
}