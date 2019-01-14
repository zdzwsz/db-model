import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';


export default class CodeEdit extends React.Component {
    constructor(props) {
        super(props);
        this.fontSize = 14;
        this.state ={}
        this.state.code = props.code;
    }

    componentDidMount() {
        this.setValue();
    }

    setValue(i) {
        if(typeof(i)=="undefined"){
            i=0;
        }
        if (i < 20) {
            var _this = this;
            window.setTimeout(function () {
                if (_this.refs.codeFrame.contentWindow && _this.refs.codeFrame.contentWindow.editor != null) {
                    let editor = _this.refs.codeFrame.contentWindow.editor;
                    let monaco_editor = _this.refs.codeFrame.contentWindow.monaco_editor;
                    var langModel = monaco_editor.createModel(_this.state.code, "javascript");
                    editor.setModel(langModel);
                    editor.onDidBlurEditorText(function () {
                        console.log("change1");
                        _this.state.code = editor.getValue();
                        _this.onChange();
                    });
                    editor.onKeyDown(function (e) {
                        if (e.ctrlKey && e.keyCode == 49) {
                            _this.state.code = editor.getValue();
                            _this.saveContent()
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    })
                } else {
                    i++;
                    _this.setValue(i);
                }
            }, 200);
        }
    }

    saveContent(){
       if(this.props.onSaveShortcut){
        this.props.onSaveShortcut(this.state.code);
       }
    }

    onChange(){
        if(this.props.onChange){
            this.props.onChange(this.state.code);
        }
    }

    undo() {
        this.getEditor().trigger("keyboard", "undo", null);
    }

    redo() {
        this.getEditor().trigger("keyboard", "redo", null);
    }

    formatDocument() {
        var action = this.getEditor().getAction("editor.action.formatDocument");
        action.run().done();
    }

    magnifyFont(type) {
        if (type == 0) {
            this.fontSize = this.fontSize + 2;
            if (this.fontSize > 20) this.fontSize = 20;
            this.getEditor().updateOptions({ 'fontSize': this.fontSize });
        } else {
            this.fontSize = this.fontSize - 2;
            if (this.fontSize < 12) this.fontSize = 12;
            this.getEditor().updateOptions({ 'fontSize': this.fontSize });
        }
    }

    getEditor() {
        return this.refs.codeFrame.contentWindow.editor;
    }

    render() {
        return (
            <Card style={{ width: 946 }}>
                <CardContent>
                    <span style={{ paddingLeft: 20 }}>
                        <Button onClick={this.formatDocument.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2, padding: 1 }}>
                            <FormatIndentIncreaseIcon />格式
                        </Button>
                        <Button onClick={this.undo.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2, padding: 1 }}>
                            <UndoIcon />撤销
                        </Button>
                        <Button onClick={this.redo.bind(this)} variant="outlined" color="secondary" size="small" style={{ margin: 2, padding: 1 }}>
                            <RedoIcon />恢复
                        </Button>
                        <Button onClick={this.magnifyFont.bind(this, 0)} variant="outlined" color="secondary" size="small" style={{ margin: 2, padding: 1 }}>
                            <ZoomInIcon />放大
                        </Button>
                        <Button onClick={this.magnifyFont.bind(this, 1)} variant="outlined" color="secondary" size="small" style={{ margin: 2, padding: 1 }}>
                            <ZoomOutIcon />缩小
                        </Button>
                    </span>
                    <div>
                        <iframe style={{ width: '100%', height: 480 }} src="/static/javascript.html" ref="codeFrame" id="myiframe" frameBorder="0" scrolling="no"></iframe>
                    </div>
                </CardContent>
            </Card>
        )
    }
}