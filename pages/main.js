import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/AddCircle';
import Layout from './layout';
import Category from '../component/Category';
import {Modal,ModalTag} from '../component/Modal';
import Avatar from '@material-ui/core/Avatar';
import AppStore from '../util/AppStore';

const classes = {
    chipClass: {
        margin: 2,
        minWidth:90
    },
    CardClass: {
        margin: 8,
        width: 420
    },
    GriditemClass: {
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        flexDirection: 'row'
    }
}

export default class main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            services: props.json.data||[]
        };
        this.modal = Modal.createModal(this);
    }


    static async getInitialProps({req,query}) {
        return AppStore.getAllData(req);
     }



    handleDelete() {
        alert('You clicked the delete icon.');
    }

    handleClick() {
        alert('You clicked the Chip.');
    }


    onAddCategory(name) {
        let newObject = { name: name, disabled: false, entitys: [], apis: [] }
        this.state.services.push(newObject);
        this.setState({ services: this.state.services });
    }

    onDeleteCategory(name) {
        let services = this.state.services;
        let _this = this;
        for (let i = 0; i < services.length; i++) {
            if (services[i].name === name) {
                if (services[i].entitys.length == 0 && services[i].apis.length == 0) {
                    this.modal.confirm("确定删除服务吗？，系统不进行备份，删除后服务无法恢复！").then(function () {
                        services.splice(i, 1);
                        _this.setState({ services: services });
                    })
                } else {
                    this.modal.alert("先清空实体和API，然后才能删除服务！。");
                }
            }
        }
        
    }

    onChangeCategory(name, status) {
        let services = this.state.services;
        let service = null;
        for (let i = 0; i < services.length; i++) {
            if (services[i].name === name) {
                service = services[i];
                break;
            }
        }
        let _this = this;
        if (status == false) {
            this.modal.confirm("确定停止服务吗？停止后，API停止调用，可能导致依赖的系统无法运行！").then(function () {
                service.disabled = status;
                _this.setState({ services: services });
            })
        }else{
            service.disabled = status;
            this.setState({ services: services });
        }

    }

    editEntity(category,entityName) {
        if(entityName=="new"){
            entityName="";
        }
        Router.push({
            pathname: "/entityedit",
            query: { 'category': category, entityName:entityName},
            asPath: "/entityedit"
        });
    }

    editAPI(category,apiName) {
        if(apiName=="new"){
            apiName="";
        }
        Router.push({
            pathname: "/apiedit",
            query: { 'category': category, entityName:apiName},
            asPath: "/apiedit"
        });
    }

    handleDeleteEntity(serviceName, entityName) {
        let services = this.state.services;
        let _this = this;
        this.modal.confirm("确定删除实体，删除后数据不能恢复，你确定吗？").then(
            function () {
                for (let i = 0; i < services.length; i++) {
                    if (services[i].name === serviceName) {
                        for(let j = 0 ;j<services[i].entitys.length;j++ ){
                            if(services[i].entitys[j].name = entityName){
                                services[i].entitys.splice(j,1);
                                _this.setState({services:services});
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        )
    }

    render() {
        let _this = this;
        return (
            <Layout>
                {this.state.services.map(function (service, i) {
                    return (
                        <Grid key={i} item xs={4} style={classes.GriditemClass}>
                            <Card key={i} style={classes.CardClass}>
                                <CardContent>
                                    <Category label={service.name} disabled={service.disabled} onDelete={_this.onDeleteCategory.bind(_this)} onChange={_this.onChangeCategory.bind(_this)} />
                                    <Typography color="textSecondary">服务实体：</Typography>
                                    <Chip label="新增实体" style={classes.chipClass} onDelete={_this.editEntity.bind(_this, service.name, 'new')} onClick={_this.editEntity.bind(_this, service.name, 'new')}
                                        deleteIcon={<AddIcon />} />
                                    {service.entitys.map(function (entity, j) {
                                        let name = entity.name;
                                        let key = i + ":" + j;
                                        return (
                                            <Chip key={key} label={name} onClick={_this.editEntity.bind(_this, service.name, entity.name)} style={classes.chipClass} onDelete={_this.handleDeleteEntity.bind(_this, service.name, entity.name)} avatar={<Avatar>ENT</Avatar>} />
                                        )
                                    })}
                                    <Typography color="textSecondary">服务 API：</Typography>
                                    <Chip label="新增 API" style={classes.chipClass} onClick={_this.editAPI.bind(_this, service.name, "new")} onDelete={_this.editAPI.bind(_this, service.name, "new")}
                                        deleteIcon={<AddIcon />}  />
                                    {service.apis.map(function (api, j) {
                                        let name = api.name;
                                        let key = i + ":" + j;
                                        return (
                                            <Chip key={key} label={name} style={classes.chipClass} onClick={_this.editAPI.bind(_this, service.name, api.name)} onDelete={_this.handleDelete} avatar={<Avatar>API</Avatar>} />
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
                <Grid item xs={4} style={classes.GriditemClass}>
                    <Card style={classes.CardClass}>
                        <CardContent>
                            <Category onAddCategory={_this.onAddCategory.bind(_this)} onDelete={_this.onDeleteCategory.bind(_this)} />
                            <Typography color="textSecondary">服务实体：</Typography>
                            <Chip label="新增实体" style={classes.chipClass} onDelete={() => {
                                this.modal.tip("请先增加服务后，再新增实体！");
                            }}
                                deleteIcon={<AddIcon />} />
                            <Typography color="textSecondary">服务 API：</Typography>
                            <Chip label="新增 API" style={classes.chipClass} onDelete={() => {
                                this.modal.tip("请先增加服务后，再新增 API！");
                            }}
                                deleteIcon={<AddIcon />} />
                        </CardContent>
                    </Card>
                </Grid>
                <ModalTag config={this.modal.getConfig()} />
            </Layout>
        )
    }
}