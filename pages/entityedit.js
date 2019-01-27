import React from 'react';

import Router from 'next/router';
import Layout from './layout';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import FieldEdit from '../component/FieldEdit';
import SelectEdit from '../component/SelectEdit';
import SubTable from '../component/SubTable';
import {Modal,ModalTag} from '../component/Modal';
import AppStore from '../util/AppStore';


let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 10, alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 10, width: 980
    }
}

const setupEntityStr='请输入服务名和表名，不能有特殊符号：@#￥%……&！'
const saveTipStr = "请先进行实体配置,再保存实体信息！"



export default class EntityEdit extends React.Component {
    constructor(props) {
        super(props);
        let data ={fields:[]};
        this.category = EntityEdit.category;
        let entityName = EntityEdit.entityName||"";
        if(props.json){
            data = props.json.data
            this.changeShowData(data);
            this.category =props.json.category;
            entityName = props.json.entityName;
        }
        
        this.state = {
            name:entityName,
            detail:"",
            entity: data
        };
        //console.log(this.category+"|"+entityName+"|"+ (this.state.name==""));
        if(this.state.name=="" || typeof(this.state.name)=="undefined"){
            this.status = "new";
        }else{
            this.status = "edit";
        }
        this.modal = Modal.createModal(this);
    }

    changeShowData(data){
       let fields = data.fields;
       for(let i = 0;i<fields.length;i++){
          if(typeof(fields[i].isnew)!="undefined"){
             delete fields[i].isnew;
          }
          if(typeof(fields[i].delete)!="undefined"){
            delete fields[i].delete;
          }
          fields[i].key = fields[i].name;
          if(fields[i].name == data.primary){
            fields[i].isprimary = true;
          }
          if(fields[i]["length"]){
              let length = fields[i]["length"];
              if(Array.isArray(length)){
                  let l = length[0];
                  let d = length[1];
                  fields[i]["length"] = l;
                  fields[i]["dot"] = d;
              }
          }
          if(fields[i].type =="table"){
              this.changeShowData(fields[i].relation);
          }
       }
    }

    changeSaveData(data,status){
        let fields = data.fields;
        for(let i = fields.length-1;i>-1;i--){
           if(fields[i].isnew == true && fields[i].delete ==true){
              fields.splice(i,1);
              continue;
           }
           if(fields[i].name =="" || fields[i].type ==""){
              fields.splice(i,1);
              continue;
           }
           if(fields[i].isprimary == true){
             data.primary = fields[i].name;
           }
           if(fields[i]["length"]){
               //let length = fields[i]["length"];
               if(fields[i].type =="decimal" || fields[i].type =="float" ){
                   fields[i]["length"] = [fields[i]["length"],fields[i]["dot"]];
               }
           }
           if(fields[i].type =="table"){
               if(fields[i].relation.tableName=="" || typeof(fields[i].relation.tableName) =="undefined"){
                 fields[i].relation.tableName=fields[i].name
               }
               this.changeSaveData(fields[i].relation,status);
           }
           if(status === "new"){
               delete fields[i].isnew;
           }
        }
        return data;
    }

    checkSaveFormat(data){
        if(data.name =="" || data.tableName =="" || data.fields.length ==0){
            return false;
        }
        for(let i =0;i<data.fields.length;i++){
            if(data.fields[i].type !="table"){
                return true;
            }
        }
        return false;  
    }

    saveEntity() {
        let _this = this;
        let data = JSON.parse(JSON.stringify(this.state.entity));
        data = this.changeSaveData(data,this.status)
        //console.log(data);
        if(!this.checkSaveFormat(data)){
            this.modal.alert("请添加实体字段，再保存数据");
            return;
        }
        let result = null;
        this.modal.wait("正在保存数据，请等待......");
        if(this.status == "new"){
            result = AppStore.putNewEntity(this.category,this.state.name,data);
        }
        else{
            result = AppStore.updateEntity(this.category,this.state.name,data);
        }
        result.then(function(res){
           if(res && res.json && res.json.code=="000"){
              _this.modal.tip("保存成功");
              _this.changeShowData(data);
              _this.status="edit";
              _this.setState({entity:data});
              //console.log();
           }else if(res && res.json){
              _this.modal.tip(res.json.message);
           }else{
             _this.modal.tip("未知错误！");
           }
        });
    }


    static async getInitialProps({query,req}) {
        EntityEdit.category = query.category;
        EntityEdit.entityName = query.entityName;
        let result = AppStore.getEntity(req,query.category,query.entityName);
        //console.log(result);
        if(result instanceof Promise){
            result = await result.then();
            result.json.category = query.category;
            result.json.entityName = query.entityName;
        }else{
            result.json.category = query.category;
            result.json.entityName = query.entityName;
        }
        return result;
     }

    addRow() {
        let fields = this.state.entity.fields;
        fields.push({ isnew: true, name: '', detail: '', type: '', length: 0, dot: 0, notNullable: false, isprimary: false });
        this.setState({ entity: this.state.entity });
        //console.log(this.state);
    }

    selectRow = event => {
        if (event) {
            let field = this.state.entity.fields[event.target.value];
            if (field) {
                field.select = event.target.checked;
            }
        }
    };

    deleteRow() {
        
        let fields = this.state.entity.fields;
        for (let i = fields.length - 1; i > -1; i--) {
            if (fields[i].select == true) {
                fields[i].delete = true;
            }
        }
        this.setState({ entity: this.state.entity });
    }

    //=======================================================子表操作

    selectRowBySubTable(i,checked) {
        this.state.entity.fields[i].select = checked;
    }

    selectSubTableRow(i,j,checked){
        this.state.entity.fields[i].relation.fields[j].select = checked;
    }
    addSubTableRow(i) {
        //console.log(this.state.entity.fields[i].relation.fields.length)
        let fields = this.state.entity.fields[i].relation.fields;
        fields.push({ isnew: true, name: '', detail: '', type: '', length: 0, dot: 0, notNullable: false, isprimary: false });
        this.setState({ entity: this.state.entity });
    }

    deleteSubTableRow(i){
        let fields = this.state.entity.fields[i].relation.fields;
        for (let j = fields.length - 1; j > -1; j--) {
            if (fields[j].select == true) {
                fields[j].delete = true;
            }
        }
        this.setState({ entity: this.state.entity });
    }

    onChangeSubTableKey(i,j, name, value) {
        //console.log(i+":"+j+":"+name+":"+value);
        let field = this.state.entity.fields[i].relation.fields[j];
        field[name] = value;
        //console.log(this.state.entity);
        if (name == "type") {
            this.defaultType(field);
        }
        this.setState({ entity: this.state.entity });
    }

  //===========================================================

    returnMain() {
        Router.push("/main");
    }

    onChangeKey(i, name, value) {
        //console.log(i+":"+name+":"+value);
        let field = this.state.entity.fields[i];
        field[name] = value;
        if (name == "type") {
            this.defaultType(field);
            this.setState({ entity: this.state.entity });
        }
    }

    onChangeSwitch(event) {
        //console.log(event.target.checked)
        let name = event.target.name;
        let i = event.target.id;
        let value = event.target.checked
        let field = this.state.entity.fields[i];
        field[name] = value;
        this.setState({ entity: this.state.entity });
    }

    defaultType(field) {
        if (field.type == "int") {
            this.setDefaultValue(field, "length", 8);
            this.setDefaultValue(field, "dot", 0);
        }
        if (field.type == "string") {
            this.setDefaultValue(field, "length", 200);
            this.setDefaultValue(field, "dot", 0);
        }
        if (field.type == "decimal") {
            this.setDefaultValue(field, "length", 16);
            this.setDefaultValue(field, "dot", 2);
        }
        if (field.type == "datetime") {
            this.setDefaultValue(field, "length", 0);
            this.setDefaultValue(field, "dot", 0);
        }
        if (field.type == "increment") {
            this.setDefaultValue(field, "length", 8);
            this.setDefaultValue(field, "dot", 0);
        }
        if (field.type == "table") {
            this.setDefaultValue(field, "length", 0);
            this.setDefaultValue(field, "dot", 0);
            if(!field.relation){
                field.relation={},
                field.relation.fields=[]
            }
        }
    }

    setDefaultValue(field, name, value) {
        field[name] = value;
    }

    prepareSaveEntity() {
        if (this.state.name == "" || this.state.name == null) {
            this.modal.alert(saveTipStr);
        } else {
            this.saveEntity()
        }
    }

    showDialog() {
        let _this = this;
        let prompt = this.modal.prompt(setupEntityStr,
            [{label:'请输入实体名(必填)',value:this.state.name},
             {label:'请输入表名(必填)',value:this.state.entity.tableName}]);
        prompt.then(function(values){
            _this.state.name = values[0].value;
            _this.state.entity.tableName = values[1].value;
        })
    }

    render() {
        let _this = this;
        return (
            <Layout>
                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <div style={{ width: 950 }}>
                            <Button onClick={this.showDialog.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>实体配置</Button>
                            <Button onClick={this.addRow.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>新增行</Button>
                            <Button onClick={this.deleteRow.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>删除行</Button>
                            <Button onClick={this.prepareSaveEntity.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>保存</Button>
                            <Button onClick={this.returnMain.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>返回</Button>
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ width: 50 }} padding="checkbox">选择</TableCell>
                                    <TableCell style={{ width: 140 }} padding="none">名称</TableCell>
                                    <TableCell align="center" style={{ width: 200 }} padding="none">注释</TableCell>
                                    <TableCell align="center" style={{ width: 150 }} padding="none">类型</TableCell>
                                    <TableCell align="center" style={{ width: 120 }} padding="none">长度</TableCell>
                                    <TableCell align="center" style={{ width: 90 }} padding="none">小数点</TableCell>
                                    <TableCell align="center" style={{ width: 70 }} padding="none">不许空</TableCell>
                                    <TableCell align="center" style={{ width: 70 }} padding="none">主键</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.entity.fields.map(function (field, i) {
                                    if (field.delete == true) {
                                    } else {
                                        if (field.type == "table") {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell colSpan={8} padding="none">
                                                       <SubTable 
                                                        name ={field.name} 
                                                        detail ={field.detail}
                                                        type={field.type}
                                                        relation={field.relation}
                                                        id ={i}
                                                        onFieldChange={_this.onChangeKey.bind(_this)}
                                                        onFieldSelect={_this.selectRowBySubTable.bind(_this)}
                                                        selectSubTableRow={_this.selectSubTableRow.bind(_this)}
                                                        addSubTableRow={_this.addSubTableRow.bind(_this)}
                                                        deleteSubTableRow={_this.deleteSubTableRow.bind(_this)}
                                                        onFieldEdit = {_this.onChangeSubTableKey.bind(_this)}
                                                         />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        } else {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell align="center" padding="checkbox"><Checkbox value={i + ""} onChange={_this.selectRow} /></TableCell>
                                                    <TableCell padding="none">
                                                        <FieldEdit id={i} name="name" onChange={_this.onChangeKey.bind(_this)} value={field.name} />
                                                    </TableCell>
                                                    <TableCell padding="none">
                                                        <FieldEdit id={i} name="detail" onChange={_this.onChangeKey.bind(_this)} value={field.detail} />
                                                    </TableCell>
                                                    <TableCell align="center" padding="none">
                                                        <SelectEdit id={i} name="type" onChange={_this.onChangeKey.bind(_this)} value={field.type} />
                                                    </TableCell>
                                                    <TableCell align="center" padding="none">
                                                        <FieldEdit id={i} type="number" name="length" value={field['length']} onChange={_this.onChangeKey.bind(_this)} />
                                                    </TableCell>
                                                    <TableCell align="center" padding="none">
                                                        <FieldEdit id={i} type="number" name="dot" value={field['dot']} onChange={_this.onChangeKey.bind(_this)} />
                                                    </TableCell>
                                                    <TableCell align="center" padding="none"><Switch id={i + ""} name="notNullable" checked={field.notNullable} onChange={_this.onChangeSwitch.bind(_this)} /></TableCell>
                                                    <TableCell align="center" padding="none"><Switch id={i + ""} name="isprimary" checked={field.isprimary} onChange={_this.onChangeSwitch.bind(_this)} /></TableCell>
                                                </TableRow>
                                            )
                                        }
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                     <ModalTag config={this.modal.getConfig()} />
                </Grid>
            </Layout>

        )
    }
}
EntityEdit.category = "";
EntityEdit.entityName ="";