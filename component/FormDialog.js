import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormDialog extends React.Component {
  constructor(props) {
        super(props);
        this.state={open : false}
        this.state.tableName = props.tableName;
        this.state.name = props.name;
        this.state.title = props.title;
        this.state.content = props.content;
        
  }

  handleClose = () => {
    this.setState({ open: false });
    if(this.props.cancel){
        this.props.cancel(this.state.value);
    }
  };

  handleOk= () => {
    this.setState({ open: false });
    if(this.props.ok){
        this.props.ok(this.state.name,this.state.tableName);
    }
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        open: nextProps.open,
        tableName:nextProps.tableName
    });
}

  render() {
    return (
        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.content}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="请输入服务名："
              fullWidth
              onChange = {this.handleChange.bind(this)}
              value = {this.state.name}
            /> 
            <TextField
              margin="dense"
              name="tableName"
              label="请输入表名："
              fullWidth
              onChange = {this.handleChange.bind(this)}
              value = {this.state.tableName}
            /> 
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              取消
            </Button>
            <Button onClick={this.handleOk.bind(this)} color="primary">
              确定
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}