import React from 'react';

import Router from 'next/router';
import Layout from './layout';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Modal, ModalTag } from '../component/Modal';
import CodeEdit from "../component/CodeEdit";
import AppStore from '../util/AppStore';
import {Base64} from '../util/UserUtil';

const templet = "/*\n" +
    "* 服务说明:这是新建模板\n" +
    "* @db 数据访问接口\n" +
    "* @reply 返回数据函数\n" +
    "*/\n" +
    "service('服务名', function (参数, db, reply) {\n\n" +
    "\t //服务逻辑,使用reply返回客户端数据\n\n" +
    "})";

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    }

}

function service(name,func){
   return name;
}
export default class ApiEdit extends React.Component {
    constructor(props) {
        super(props);
        this.category = "";
        this.apiName = "";
        let data = "";
        if(props.json){
            //console.log(props.json)
            data = props.json.data
            this.category =props.json.category;
            this.apiName = props.json.apiName;
        }
        if(data == null){
            data = templet;
            this.status="new";
        }else{
            data = Base64.decode(data);
            this.status="edit";
        }
        this.state = {
            code: data
        };
        this.modal = Modal.createModal(this);
    }

    static async getInitialProps({ query,req }) {
        let category = query.category;
        let apiName = query.apiName;
        let result = AppStore.getApiCode(req,category,apiName);
        //console.log(result);
        if(result instanceof Promise){
            result = await result.then();
            result.json.category = category;
            result.json.apiName = apiName;
        }else{
            result.json.category = category;
            result.json.apiName = apiName;
        }
        return result;
    }

    returnMain() {
        Router.push("/main");
    }

    onChangeCodeEdit(value) {
        this.state.code = value;
    }

    saveApi(newcode) {
        if(typeof(newcode)!="undefined" && typeof(newcode) =="string"){
            this.state.code = newcode;
        }
        let code = this.state.code;
        let _this = this;
        try{
           let name = eval(code);
           let result= null;
           console.l
           if(name.length >0){
             code = Base64.encode(code);
             if(this.status =="new"){
                this.apiName = name;
                result= AppStore.putNewApiCode(this.category,this.apiName,code);
             }else{
                if(this.apiName != name){
                    _this.modal.alert("以前的API名称和现在的API名称不一样，不能更改API名称！");
                    return;
                }else{
                    result= AppStore.updateApiCode(this.category,this.apiName,code);
                }
             }
             result.then(function(res){
                if(res && res.json && res.json.code=="000"){
                    _this.modal.tip("保存成功");
                    _this.status="edit";
                    //console.log();
                 }else if(res && res.json){
                    _this.modal.tip(res.json.message);
                 }else{
                   _this.modal.tip("未知错误！");
                 }
             })
           }else{
               _this.modal.tip("请定义API名称！");
           }
        }catch(e){
            Modal.alert("服务代码编写有误："+e.message);
        }
        
    }

    render() {
        let _this = this;
        return (
            <Layout>
                <Grid item xs={12} style={classes.GridStyle}>
                    <div style={{ width: 960, padding: 5 }}>
                        <Button onClick={this.saveApi.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>保存</Button>
                        <Button variant="outlined" color="secondary" style={{ margin: 2 }}>例子&API</Button>
                        <Button variant="outlined" onClick={this.returnMain.bind(this)} color="secondary" style={{ margin: 2 }}>返回</Button>
                    </div>
                    <CodeEdit code={this.state.code} onChange={this.onChangeCodeEdit.bind(this)} onSaveShortcut={this.saveApi.bind(this)} />
                    <ModalTag config={this.modal.getConfig()} />
                </Grid>
            </Layout>

        )
    }
}