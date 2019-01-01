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
import Index from '.';

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
        servers : [
            {serverName:"local",ip:"127.0.0.1",port:"8080"},
            {serverName:"local1",ip:"127.0.0.1",port:"8080"},
            {serverName:"local2",ip:"127.0.0.1",port:"8080"}
        ]
    };


    deleteServer(i) {
        console.log(i);
        this.state.servers.splice(i,1);
        this.setState({servers:this.state.servers});
    };


    render() {
        let _this = this;
        return (
            <Grid container spacing={8} style={{ padding: 10 }}>

                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <TextField
                            id="serverName"
                            label="服务名称"
                            name="serverName"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                        />
                        <TextField
                            id="serverIp"
                            label="服务IP"
                            name="serverIp"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                        />
                        <TextField
                            id="serverPort"
                            label="服务端口"
                            name="serverPort"
                            margin="normal"
                            variant="outlined"
                            style={{ margin: 2 }}
                        />
                        <Button variant="contained" component="span" type="button" style={{ margin: 2, height: 54 }}>保存</Button>
                        <Button variant="contained" component="span" type="button" onClick={this.handleIndex} style={{ margin: 2, height: 54 }}>返回</Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} style={classes.GridStyle}>
                    <Paper style={classes.PaperStyle}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>序号</TableCell>
                                    <TableCell >名称</TableCell>
                                    <TableCell >ip地址</TableCell>
                                    <TableCell >端口</TableCell>
                                    <TableCell >删除</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.servers.map(function(row,i) {
                                    return (
                                        <TableRow key={i+1}>
                                            <TableCell>
                                               {i+1}
                                            </TableCell>
                                            <TableCell >{row.serverName}</TableCell>
                                            <TableCell >{row.ip}</TableCell>
                                            <TableCell >{row.port}</TableCell>
                                            <TableCell ><Button variant="contained" component="span" type="button" onClick={_this.deleteServer.bind(this,i)}>删除</Button></TableCell>
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