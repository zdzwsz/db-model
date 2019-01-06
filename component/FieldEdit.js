import React from 'react';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


export default class FieldEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'view',
            
        };
        this.state.id = props.id;
        this.state.name = props.name;
        this.state.value = props.value;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        });
    }

    editStatus() {
        this.setState({ status: 'edit' })
    }

    onBlur() {
        this.setState({ status: 'view' })
        if(this.props.onChange){
            this.props.onChange(this.state.id,this.state.name,this.state.value)
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })
    }

    render() {
        if (this.state.status == 'view') {
            return (
                <div onClick={this.editStatus.bind(this)} style={{height:35,padding:4}}>
                <Typography style={{fontSize: 14,marginTop: 4}} >
                    {this.state.value}
                </Typography>
                </div>
            )
        } else if (this.state.status == 'edit') {
            if(this.props.type){
                return (
                    <div style={{ paddingRight: 8 }}>
                        <TextField
                            value={this.state.value}
                            onChange={this.handleChange.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            margin="normal"
                            style={{ height: 32, marginTop: 10 }}
                            variant="outlined"
                            autoFocus
                            type="number"
                        />
                    </div>
                )
            }else{
                return (
                    <div style={{ paddingRight: 8 }}>
                        <TextField
                            value={this.state.value}
                            onChange={this.handleChange.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            margin="normal"
                            style={{ height: 32, marginTop: 10 }}
                            variant="outlined"
                            autoFocus
                        />
                    </div>
                )
            }
            
        }
    }
}