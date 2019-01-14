import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Router from 'next/router';
let localStorage = require("../util/Storage").localStorage();

let classes = {
    GridStyle: {
        display: 'flex', alignItems: 'center', flexDirection: 'column'
    },
    PaperStyle: {
        padding: 30, alignItems: 'center', width: 650, display: 'flex', flexDirection: 'row'
    },
    divStyle: {
        width: 650
    }
}

export default class servermgr extends React.Component {
    constructor(props) {
        super(props);
        this.deleteServer = this.deleteServer.bind(this);
    }

    handleIndex = () => {
        Router.push("/index");
    };

    state = {
        servers: [
        ],
        name: "",
        ip: "",
        port: ""
    };

    componentWillMount() {
        let jsonString = localStorage.getItem("servers");
        console.log(jsonString);
        let jsonObjects = []
        if (jsonString) {
            jsonObjects = JSON.parse(jsonString);
        }
        if (Array.isArray(jsonObjects)) {
            this.setState({servers:jsonObjects}); 
        }
    }

    deleteServer(i) {
        console.log(i);
        this.state.servers.splice(i, 1);
        this.setState({ servers: this.state.servers });
        localStorage.setItem("servers", JSON.stringify(this.state.servers));
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    saveServer(){
       let newServer = {name:this.state.name,ip:this.state.ip,port:this.state.port};
       this.state.servers.push(newServer);
       this.setState({ servers: this.state.servers });
       this.state.name = "";
       this.state.ip = "";
       this.state.port = "";
       localStorage.setItem("servers", JSON.stringify(this.state.servers));
    };

    render() {
        let _this = this;
        return (
            <Grid container spacing={8} style={{ padding: 10 }}>

                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <TextField
                            id="name"
                            label="服务名称"
                            name="name"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                            onChange={this.handleChange} value={this.state.name}
                        />
                        <TextField
                            id="ip"
                            label="服务IP"
                            name="ip"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                            onChange={this.handleChange} value={this.state.ip}
                        />
                        <TextField
                            id="port"
                            label="服务端口"
                            name="port"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                            onChange={this.handleChange} value={this.state.port}
                        />
                        <Button variant="contained" component="span" type="button" onClick={this.saveServer.bind(this)} style={{ margin: 2, height: 54 }}>保存</Button>
                        <Button variant="contained" component="span" type="button" onClick={this.handleIndex} style={{ margin: 2, height: 54 }}>返回</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: 80 }}>序号</TableCell>
                                    <TableCell style={{ width: 200 }}>名称</TableCell>
                                    <TableCell style={{ width: 180 }}>ip地址</TableCell>
                                    <TableCell style={{ width: 80 }}>端口</TableCell>
                                    <TableCell >删除</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.servers.map(function (row, i) {
                                    return (
                                        <TableRow key={i + 1}>
                                            <TableCell>
                                                {i + 1}
                                            </TableCell>
                                            <TableCell padding="checkbox">{row.name}</TableCell>
                                            <TableCell >{row.ip}</TableCell>
                                            <TableCell >{row.port}</TableCell>
                                            <TableCell ><Button variant="contained" component="span" type="button" onClick={_this.deleteServer.bind(this, i)}>删除</Button></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}