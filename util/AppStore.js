import { decryptParameter, getCookie } from "../util/UserUtil";
import fetch from 'isomorphic-unfetch';
import setup from "../pages/setup";

const ALL_URL = "/meta/all";
const BASE = "/meta";

let AppStore = {
    getAllData(req) {
        return FetchData(req, ALL_URL);
    },
    addService(category){
        let url = BASE + "/" + category + "/add";
        return FetchData(null, url);
    },
    deleteService(category){
        let url = BASE + "/" + category + "/delete";
        return FetchData(null, url);
    },
    stopServer(category){
        let url = BASE + "/" + category + "/stop";
        return FetchData(null,url);
    },
    startServer(category){
        let url = BASE + "/" + category + "/start";
        return FetchData(null,url);
    },
    getEntity(req, category, name) {
        if(name){
            let url = BASE + "/" + category + "/" + name + "/get"
            return FetchData(req, url);
        }else{
            return {json:{data:{fields:[]}}};
        }
    },
    putNewEntity(category,name,data){
       let url = BASE + "/" + category + "/" + name + "/add"
       return FetchData(null,url,data);
    },
    deleteEntity(category,name){
        let url = BASE + "/" + category + "/" + name + "/delete"
        return FetchData(null,url);
    },
    updateEntity(category,name,data){
        let url = BASE + "/" + category + "/" + name + "/update"
        return FetchData(null,url,data);
    },
    getApiCode(req, category, apiname){
       if(apiname){
        let url = BASE + "/" + category +  "/gcode"
        return FetchData(req,url,{name:apiname});
       }else{
           return {json:{data:null}};
       }
    },
    putNewApiCode(category,name,data){
        let url = BASE + "/" + category + "/scode"
        return FetchData(null,url,{name:name,code:data});
    },
    updateApiCode(category,name,data){
        return this.putNewApiCode(category,name,data);
    },
    deleteApiCode(category,apiname){
        let url = BASE + "/" + category + "/dcode"
        return FetchData(null,url,{name:apiname});
    },
    setupServer(data){
        let url = "/setup/config"
        return FetchData(null,url,data);
    },
    modifyPwd(data){
        let url = "/setup/pwd"
        return FetchData(null,url,data);
    },
    
}

async function FetchData(req, path, parameters) {
    let parameterStr = getCookie((req ? req.headers["cookie"] : document.cookie), "parameter");
    let body = parameters ||{};
    if (parameterStr) {
        let parameter = decryptParameter(parameterStr);
        let url = parameter[0] + path;
        const res = await fetch(url, {
            'method': 'POST',
            'mode': 'cors',
            'headers': {
                "Content-Type": "application/json",
                'x-access-token': parameter[1]
            },
            'body': JSON.stringify(body)
        })
        const json = await res.json()
        return {json}
    } else {
        return null;
    }
}

export default AppStore;