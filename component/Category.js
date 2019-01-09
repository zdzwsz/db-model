import React from 'react';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/AddCircle';
import StorageIcon from '@material-ui/icons/Storage';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

export default class Category extends React.Component {
    constructor(props) {
        super(props);
        if (props.label && props.label != "") {
            this.state.status = 'old';
            this.state.label = props.label
            this.state.disabled = props.disabled
        }
        this.state.name = "";
    }

    state = {
        status: 'new',
        label: '',
        disabled:false
    };

    handleClick() {
        alert('You clicked the Chip.');
    }

    editService() {
        this.setState({ status: 'edit' });
    }

    cancelService() {
        this.setState({ status: 'new' });
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleDelete() {
        if (this.props.onDelete) {
            this.props.onDelete(this.state.label);
        }
    }

    onSave() {
        if (this.state.name == "") {
            this.cancelService();
            return;
        }
        if (this.props.onAddCategory) {
            this.props.onAddCategory(this.state.name);
            this.state.name = "";
            this.setState({ status: 'new' });
        } else {
            this.state.label = this.state.name;
            this.state.name = "";
            this.setState({ status: 'old' });
        }
        
    }

    handleSwitchChange = event => {
        if (this.props.onChange) {
            this.props.onChange(this.state.label,event.target.checked);
        }
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            disabled: nextProps.disabled
        });
    }


    render() {
        if (this.state.status == 'new') {
            return (
                <div>
                    <Chip label="新增服务" style={{ margin: 4 }} onDelete={this.editService.bind(this)} color="primary" variant="outlined" deleteIcon={<AddIcon />} />
                </div>
            )
        } else if (this.state.status == 'old') {
            return (
                <div>
                    <Chip icon={<StorageIcon />} style={{ margin: 4 }} label={this.state.label} color="primary" variant="outlined" onDelete={this.handleDelete.bind(this)} />
                    <div style={{ float: 'right' }}>
                        <Switch value="disabled" name ="disabled" checked={this.state.disabled} onChange={this.handleSwitchChange} />停用/启用
                    </div>
                </div>
            )
        } else if (this.state.status == 'edit') {
            return (
                <div>
                    <TextField
                        id="name"
                        label="服务名称(英文)"
                        name="name"
                        margin="normal"
                        variant="outlined"
                        style={{ margin: 2 }}
                        onChange={this.handleChange} value={this.state.name}
                    />
                    <Button onClick={this.onSave.bind(this)} variant="contained" component="span" type="button" style={{ margin: 2, height: 54 }}>保存</Button>
                    <Button onClick={this.cancelService.bind(this)} variant="contained" component="span" type="button" style={{ margin: 2, height: 54 }}>取消</Button>
                </div>
            )
        }
    }
}