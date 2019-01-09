import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';

class ModalTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.open = props.config.open;
        this.state.title = props.config.title;
        this.state.message = props.config.message;
        this.state.type = props.config.type;
        this.state.close = props.config.close;
    }

    handleCancel = () => {
        this.setState({ open: false });
        if(this.state.close){
            this.state.close();
        }
        if(this.state.onCanel){
                this.state.onCanel(false);
        }
    };

    handleOk = () => {
        this.setState({ open: false });
        if(this.state.close){
            this.state.close();
        }
        if(this.state.onOk){
            this.state.onOk(true);
        }
    };



    componentWillReceiveProps(nextProps) {
        this.setState({
            open: nextProps.config.open,
            title: nextProps.config.title,
            message: nextProps.config.message,
            type: nextProps.config.type,
            onCanel:nextProps.config.onCanel,
            onOk:nextProps.config.onOk
        });
    }

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth = "sm"
                fullWidth = {true}
            >
                <DialogTitle id="alert-dialog-title">
                   {this.state.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                {
                    this.state.type != 'alert' ? 
                    <Button onClick={this.handleCancel.bind(this)} variant="outlined" color="primary">取消</Button>:""
                }
                    <Button onClick={this.handleOk.bind(this)} variant="outlined" color="primary" autoFocus>确定</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ModalTag;