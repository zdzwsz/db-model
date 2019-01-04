import React from 'react';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/AddCircle';
import StorageIcon from '@material-ui/icons/Storage';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Category extends React.Component {
    constructor(props) {
        super(props);
        
        if (props.label && props.label != "") {
            this.state.status ='old';
            this.state.label = props.label
        }

        this.state.name = "";
    }

    state = {
        status: 'new',
        label :''
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
            this.props.onSave(this.state.label);
        }
    }

    onSave() {
        if(this.state.name ==""){
            this.cancelService();
            return;
        }
        if (this.props.onSave) {
            this.props.onSave(this.state.name);
        } else {
            this.state.label = this.state.name;
            this.state.name = "";
            this.setState({ status: 'old' });
        }
    }

    render() {
        if (this.state.status == 'new') {
            return (
                <Chip label="新增服务" style={{ margin: 4 }} onDelete={this.editService.bind(this)} color="primary" variant="outlined" deleteIcon={<AddIcon />} />
            )
        } else if (this.state.status == 'old') {
            return (
                <Chip icon={<StorageIcon />} style={{ margin: 4 }} label={this.state.label} color="primary" variant="outlined"
                    onDelete={this.handleDelete.bind(this)} />
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