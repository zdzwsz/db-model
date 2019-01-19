import React from 'react';

import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default class SelectEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'view',
        };
        this.state.id = props.id;
        this.state.name = props.name;
        this.state.value = props.value;
    }

    editStatus() {
        this.setState({ status: 'edit' })
    }

    onBlur() {
        this.setState({ status: 'view' })
        if (this.props.onChange) {
            this.props.onChange(this.state.id,this.state.name, this.state.value)
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
       
    }

    handleFocus(event){
        this.setState({ status: 'edit' })
    }

    render() {
        if (this.state.status == 'view') {
            return (
                <div onClick={this.editStatus.bind(this)} style={{ height: 35, padding: 4 }}>
                    <Typography style={{ fontSize: 14, marginTop: 4 }} >
                        {this.state.value}
                    </Typography>
                    <input type="button" onFocus={this.handleFocus.bind(this)} style={{border:0,width:0,height:0,backgroundColor:0,opacity: 0.2}}></input>
                </div>
            )
        } else if (this.state.status == 'edit') {
            return (
                <div style={{ padding: 4,width:150 }}>
                    <Select
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                        onBlur = {this.onBlur.bind(this)}
                        variant="outlined"
                        autoFocus
                        style={{width:150 }}
                    >
                        <MenuItem value="increment">increment</MenuItem>
                        <MenuItem value="string">string</MenuItem>
                        <MenuItem value="int">int</MenuItem>
                        <MenuItem value="datetime">datetime</MenuItem>
                        <MenuItem value="decimal">decimal</MenuItem>
                        <MenuItem value="table">table</MenuItem>
                    </Select>
                </div>
            )
        }
    }
}