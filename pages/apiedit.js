import React from 'react';

import Router from 'next/router';
import Layout from './layout';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Modal,ModalTag} from '../component/Modal';
import CodeEdit from "../component/CodeEdit";

const templet = "/*\n"+
                "* 服务说明:这是新建模板\n"+
                "* @db 数据访问接口\n"+
                "* @reply 返回数据函数\n"+
                "*/\n"+
                "service('服务名', function (参数, db, reply) {\n\n"+
                  "\t //服务逻辑,使用reply返回客户端数据\n\n"+   
                "})";

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    }
  
}

export default class ApiEdit extends React.Component {
    constructor(props) {
        super(props);
        this.category = props.query.category;
        let entityName = props.query.entityName||"";

        this.state = {
           code : templet
        };
        this.modal = Modal.createModal(this);
    }

    static async getInitialProps({query}) {
        return {query}
     }

     returnMain() {
        Router.push("/main");
    }

    onChangeCodeEdit(value){
      this.state.code = value;
    }

    saveApi(code){
      if(typeof(code)=="undefined"){
        code=this.state.code;
      }
      console.log(code);
    }

    render() {
        let _this = this;
        return (
            <Layout>
                <Grid item xs={12} style={classes.GridStyle}>
                    <div style={{ width: 960,padding:5 }}>
                    <Button  variant="outlined" onClick={this.returnMain.bind(this)} color="secondary" style={{ margin: 2 }}>返回</Button>
                            <Button onClick={this.saveApi.bind(this)}  variant="outlined" color="secondary" style={{ margin: 2 }}>保存</Button>
                            <Button  variant="outlined" color="secondary" style={{ margin: 2 }}>例子&API</Button>
                     </div>
                    <CodeEdit code = {this.state.code } onChange = {this.onChangeCodeEdit.bind(this)} onSaveShortcut={this.saveApi.bind(this)}  />
                     <ModalTag config={this.modal.getConfig()} />
                </Grid>
            </Layout>

        )
    }
}