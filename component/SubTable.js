
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

const buttonValue = ['隐藏子表行','显示子表行']

export default class SubTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.id = props.id + "";
        this.state.name = props.name;
        this.state.detail = props.detail;
        this.state.type = props.type;
        this.state.relation = props.relation;
        this.state.hide = false;
        this.state.buttonDisabled = false;
        this.state.buttonValue = 0;
    }

    onChangeKey(i, name, value) {
        if (this.props.onFieldChange) {
            this.props.onFieldChange(i, name, value);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            relation: nextProps.relation,
            name:nextProps.name,
            detail:nextProps.detail
        });
    }

    selectSubTable(event){
        if(this.props.onFieldSelect){
            this.props.onFieldSelect(event.target.value,event.target.checked);
        }
    }

    handleSelect(event){
        if(this.props.selectSubTableRow){
            this.props.selectSubTableRow(this.state.id,event.target.value,event.target.checked);
        }
    }

    handleAddRow(){
        if(this.props.addSubTableRow){
            this.props.addSubTableRow(this.state.id);
        }
    }

    handleDeleteRow(){
        if(this.props.deleteSubTableRow){
            this.props.deleteSubTableRow(this.state.id);
        }
    }

    handleFieldEdit(j,name,value){
        if(this.props.onFieldEdit){
            this.props.onFieldEdit(this.state.id,j,name,value);
        }
    }

    handleSwitch(event) {
        let name = event.target.name;
        let j = event.target.id;
        let value = event.target.checked
        if(this.props.onFieldEdit){
            this.props.onFieldEdit(this.state.id,j,name,value);
        }
    }

    hideOrShowRow(){
        let status = this.state.hide = !this.state.hide;
        this.state.relation.fields.map(function(field,i){
            field.hide = status;
        })
        this.state.buttonDisabled = status;
        this.state.buttonValue = (this.state.buttonValue + 1)%2
        this.setState({relation:this.state.relation});
    }

    render() {
        let _this = this;
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="center" style={{ width: 50 }} padding="checkbox">
                            <Checkbox value={this.state.id} onChange={this.selectSubTable.bind(this)} />
                        </TableCell>
                        <TableCell padding="none" style={{ width: 140 }}>
                            <FieldEdit id={this.state.id} name="name" onChange={this.onChangeKey.bind(this)} value={this.state.name} />
                        </TableCell>
                        <TableCell padding="none" style={{ width: 200 }}>
                            <FieldEdit id={this.state.id} name="detail" onChange={this.onChangeKey.bind(this)} value={this.state.detail} />
                        </TableCell>
                        <TableCell align="center" padding="none" style={{ width: 150 }}>
                            <SelectEdit id={this.state.id} name="type" onChange={this.onChangeKey.bind(this)} value={this.state.type} />
                        </TableCell>
                        <TableCell colSpan={4} padding="none" align ="right" style={{ width: 380 }}>
                            <Button disabled={this.state.buttonDisabled} onClick={this.handleAddRow.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2 }}>新增子表行</Button>
                            <Button disabled={this.state.buttonDisabled} onClick={this.handleDeleteRow.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2 }}>删除子表行</Button>
                            <Button onClick={this.hideOrShowRow.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2 }}>{buttonValue[this.state.buttonValue]}</Button>
                        </TableCell>
                    </TableRow>
                    {this.state.relation.fields.map(function (field, i) {
                        if (field.delete == true || field.hide == true) {
                        } else {
                            return (
                                <TableRow key={i} style={{backgroundColor:'#F0F6F6'}}>
                                    <TableCell align="center" style={{ width: 50 }} padding="checkbox">
                                        <Checkbox value={i + ""} onChange={_this.handleSelect.bind(_this)} />
                                    </TableCell>
                                    <TableCell style={{ width: 140 }} padding="none">
                                        <FieldEdit id={i} name="name" value={field.name} onChange={_this.handleFieldEdit.bind(_this)} />
                                    </TableCell>
                                    <TableCell style={{ width: 200 }} padding="none">
                                        <FieldEdit id={i} name="detail" value={field.detail} onChange={_this.handleFieldEdit.bind(_this)} />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: 150 }} padding="none">
                                        <SelectEdit id={i} name="type" value={field.type} onChange={_this.handleFieldEdit.bind(_this)} />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: 100 }} padding="none">
                                        <FieldEdit id={i} type="number" name="length" value={field.length} onChange={_this.handleFieldEdit.bind(_this)} />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: 80 }} padding="none">
                                        <FieldEdit id={i} type="number" name="dot" value={field.dot} onChange={_this.handleFieldEdit.bind(_this)} />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: 70 }} padding="none">
                                        <Switch id={i + ""} name="notNullable" checked={field.notNullable} onChange={_this.handleSwitch.bind(_this)} />
                                    </TableCell>
                                    <TableCell align="center" style={{ width: 70 }} padding="none">
                                        <Switch id={i + ""} name="isprimary" checked={field.isprimary} onChange={_this.handleSwitch.bind(_this)} />
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    })}
                </TableBody>
            </Table>
        )
    }
}