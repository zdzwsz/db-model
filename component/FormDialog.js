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
        this.state.value = props.value;
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
        this.props.ok(this.state.value);
    }
  };

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        open: nextProps.open,
        value:nextProps.value
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
              id="name"
              label="请输入："
              fullWidth
              onChange = {this.handleChange.bind(this)}
              value = {this.state.value}
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