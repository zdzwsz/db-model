import { decryptParameter, getCookie } from "../util/UserUtil";
import fetch from 'isomorphic-unfetch';

const ALL_URL = "/meta/all";
const BASE = "/meta/";

let AppStore = {
    getAllData(req) {
        return FetchData(req, ALL_URL);
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
        return FetchData(null,url,data);
    },
    deleteApiCode(category,apiname){
        let url = BASE + "/" + category + "/dcode"
        return FetchData(null,url,{name:apiname});
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