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
import Snackbar from '@material-ui/core/Snackbar';
import ModalTag from '../component/ModalTag';
import Modal from '../component/Modal';


const classes = {
    chipClass: {
        margin: 2
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
            services: [
                {
                    name: 'petshop',
                    disabled: true,
                    entitys: [
                        { name: 'pet', detail: '宠物' },
                        { name: 'shopcar', detail: '购物车' }
                    ],
                    apis: [
                        { name: 'add', detail: '增加商品' },
                        { name: 'total', detail: '统计商品' }
                    ]
                },
                {
                    name: 'flowershop',
                    disabled: true,
                    entitys: [
                        { name: 'flower', detail: '花' }
                    ],
                    apis: []
                }
            ]
        };
        this.modal = Modal.createModal(this);
    }



    handleDelete() {
        alert('You clicked the delete icon.');
    }

    handleClick() {
        alert('You clicked the Chip.');
    }

    handleClose = () => {
        this.setState({ isTip: false });
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

    newEntity(name) {
        Router.push({
            pathname: "/entityedit",
            query: { 'name': name },
            asPath: "/entityedit"
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
                                    <Chip label="新增实体" style={classes.chipClass} onDelete={_this.newEntity.bind(_this, service.name, 'new')} onClick={_this.newEntity.bind(_this, service.name, 'new')}
                                        deleteIcon={<AddIcon />} />
                                    {service.entitys.map(function (entity, j) {
                                        let name = entity.name + ":" + entity.detail;
                                        let key = i + ":" + j;
                                        return (
                                            <Chip key={key} label={name} onClick={_this.handleClick} style={classes.chipClass} onDelete={_this.handleDeleteEntity.bind(_this, service.name, entity.name)} />
                                        )
                                    })}
                                    <Typography color="textSecondary">服务 API：</Typography>
                                    <Chip label="新增 API" style={classes.chipClass} onDelete={_this.handleDelete}
                                        deleteIcon={<AddIcon />} />
                                    {service.apis.map(function (api, j) {
                                        let name = api.name + ":" + api.detail;
                                        let key = i + ":" + j;
                                        return (
                                            <Chip key={key} label={name} style={classes.chipClass} onDelete={_this.handleDelete} />
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
                                this.setState({ isTip: true, errorMsg: '请先增加服务' });
                            }}
                                deleteIcon={<AddIcon />} />
                            <Typography color="textSecondary">服务 API：</Typography>
                            <Chip label="新增 API" style={classes.chipClass} onDelete={() => {
                                this.setState({ isTip: true, errorMsg: '请先增加服务' });
                            }}
                                deleteIcon={<AddIcon />} />
                        </CardContent>
                    </Card>
                </Grid>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.state.isTip}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.errorMsg}</span>}
                />
                <ModalTag config={this.modal.getConfig()} />
            </Layout>
        )
    }
}