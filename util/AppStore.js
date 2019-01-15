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
            return {fields:[]}
        }
    }
}

async function FetchData(req, path, parameters) {
    let parameterStr = getCookie((req ? req.headers["cookie"] : document.cookie), "parameter");
    if (parameterStr) {
        let parameter = decryptParameter(parameterStr);
        let url = parameter[0] + path;
        const res = await fetch(url, {
            'method': 'POST',
            'mode': 'cors',
            'headers': {
                'x-access-token': parameter[1]
            },
            'body': {}
        })
        const json = await res.json()
        return {json}
    } else {
        return null;
    }
}

export default AppStore;