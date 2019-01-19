import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';

class Modal {
    constructor(view) {
        this.view = view
        this.close = this.close.bind(this);
        this.config = { open: false, title: "", message: "", type: "", close: this.close, inputs: [] }
        this.view.state.modalConfig = this.config;

    }

    getTag() {
        return ModalTag;
    }

    static createModal(view) {
        return new Modal(view)
    }

    alert(message) {
        this.view.setState({ modalConfig: { open: true, title: "警告", message: message, type: "alert" } });
    }

    close() {
        this.view.state.modalConfig.open = false;
    }

    confirm(message) {
        let _this = this;
        const promise = new Promise((resolve, reject) => {
            _this.view.setState({ modalConfig: { open: true, onOk: resolve, onCanel: reject, title: "确认", message: message, type: "confirm" } });
        })

        return new Agent(promise);
    }

    prompt(message, inputs) {
        let _this = this;
        const promise = new Promise((resolve, reject) => {
            _this.view.setState({ modalConfig: { open: true, onOk: resolve, onCanel: reject, title: "输入", message: message, type: "prompt", inputs: inputs } });
        })
        return new Agent(promise);
    }

    tip(message) {
        this.view.setState({ modalConfig: { open: true, message: message, type: "tip" } });
    }

    wait(message) {
        this.view.setState({ modalConfig: { open: true, message: message, type: "wait" } });
    }

    getConfig() {
        return this.view.state.modalConfig;
    }
}

class Agent {
    constructor(promise) {
        this.promise = promise;
    }

    then(ok, canel) {
        if (typeof (canel) == "undefined") {
            canel = function () { }
        }
        return this.promise.then(ok, canel);
    }
}

class ModalTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.open = props.config.open;
        this.state.title = props.config.title;
        this.state.message = props.config.message;
        this.state.type = props.config.type;
        this.state.close = props.config.close;
        this.state.inputs = [];
    }

    handleCancel = () => {
        this.setState({ open: false });
        if (this.state.close) {
            this.state.close();
        }
        if (this.state.onCanel) {
            this.state.onCanel(false);
        }
    };

    handleChange(event) {
        let input = this.state.inputs[event.target.name]
        input.value = event.target.value
    }

    handleOk = () => {
        this.setState({ open: false });
        if (this.state.close) {
            this.state.close();
        }
        if (this.state.onOk) {
            if (this.state.type == "confirm") {
                this.state.onOk(true);
            } else if (this.state.type == "prompt") {
                this.state.onOk(this.state.inputs);
            } else {
                this.state.onOk()
            }
        }
    };


    handleClose = () => {
        this.setState({ open: false });
        if (this.state.close) {
            this.state.close();
        }
    }


    componentWillReceiveProps(nextProps) {
        let inputs = nextProps.config.inputs || [];
        this.setState({
            open: nextProps.config.open,
            title: nextProps.config.title,
            message: nextProps.config.message,
            type: nextProps.config.type,
            onCanel: nextProps.config.onCanel,
            onOk: nextProps.config.onOk,
            inputs: inputs
        });
    }

    Transition(props) {
        return <Slide direction="down" {...props} />;
    }

    render() {
        let _this = this;
        if (this.state.type == "tip") {
            return (
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={this.state.open}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.message}</span>}
                />
            )
        } else if (this.state.type == "wait") {
            return (
                <Dialog
                    fullScreen
                    open={this.state.open}
                    TransitionComponent={this.Transition}
                    style={{opacity:0.85}}
                >
                    <DialogContent style={{backgroundColor:'#999',display:'flex',alignItems: 'center',justifyContent: 'center',paddingBottom:60}}>
                         <CircularProgress style={{padding:5}} /> 
                         {this.state.message}
                    </DialogContent>
                </Dialog>
            )
        }
        else {
            return (
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogTitle id="alert-dialog-title">
                        {this.state.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.message}
                        </DialogContentText>
                        {this.state.inputs.map(function (input, i) {
                            return (
                                <TextField
                                    key={i}
                                    autoFocus
                                    margin="dense"
                                    name={i + ""}
                                    label={input.label}
                                    fullWidth
                                    onChange={_this.handleChange.bind(_this)}
                                    defaultValue={input.value}
                                />
                            )
                        })}
                    </DialogContent>
                    <DialogActions>
                        {
                            this.state.type != 'alert' ?
                                <Button onClick={this.handleCancel.bind(this)} variant="outlined" color="primary">取消</Button> : ""
                        }
                        <Button onClick={this.handleOk.bind(this)} variant="outlined" color="primary" autoFocus>确定</Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

export { Modal, ModalTag };