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
import FormDialog from '../component/FormDialog';
import SubTable from '../component/SubTable';
import Snackbar from '@material-ui/core/Snackbar';


let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 10, alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 10, width: 980
    }
}

const content='请输入服务名和表名，不能有特殊符号：@#￥%……&,默认服务名等于表名！'

export default class entityedit extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.query)
        this.state = {
            name:"",
            entity:
            {
                tableName: "",
                fields: [
                    
                ]
            },
            dialog: {
                open: false,
                content: content,
                title: "",
            },
            isTip:false,
            errorMsg:""
        };
    }

    static async getInitialProps({query}) {
        return {query}
     }

    

    addRow() {
        let fields = this.state.entity.fields;
        fields.push({ isnew: true, name: '', detail: '', type: '', length: 0, dot: 0, notnull: false, isprimary: false });
        this.setState({ entity: this.state.entity });
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
        fields.push({ isnew: true, name: '', detail: '', type: '', length: 0, dot: 0, notnull: false, isprimary: false });
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
            this.setState({isTip:true,errorMsg:'请设置实体名/表名,再保存！'});
        } else {
            this.saveEntity()
        }
    }

    saveEntity() {
        console.log(this.state.entity);
    }

    okDialog(name,tableName) {
        this.state.name = name;
        this.state.entity.tableName = tableName;
        this.state.dialog.open = false
        //this.saveEntity()
    }

    showDialog() {
        this.setState({ dialog: { open: true } });
    }

    render() {
        let _this = this;
        return (
            <Layout>
                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <div style={{ width: 950 }}>
                            <Button onClick={this.showDialog.bind(this)} variant="outlined" color="secondary" style={{ margin: 2 }}>设置实体名/表名</Button>
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
                                                    <TableCell align="center" padding="none"><Switch id={i + ""} name="notnull" checked={field.notnull} onChange={_this.onChangeSwitch.bind(_this)} /></TableCell>
                                                    <TableCell align="center" padding="none"><Switch id={i + ""} name="isprimary" checked={field.isprimary} onChange={_this.onChangeSwitch.bind(_this)} /></TableCell>
                                                </TableRow>
                                            )
                                        }
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                    <FormDialog
                        name = {this.state.name}
                        tableName={this.state.entity.tableName}
                        open={this.state.dialog.open}
                        cancel={() => { this.state.dialog.open = false }}
                        ok={this.okDialog.bind(this)}
                        title={this.state.dialog.title}
                        content={this.state.dialog.content}
                    />
                     <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'center'  }}
                            open={this.state.isTip}
                            onClose={() => {
                                this.setState({ isTip: false });
                            }}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id">{this.state.errorMsg}</span>}
                        />
                </Grid>
            </Layout>

        )
    }
}