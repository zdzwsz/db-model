import { decryptParameter, getCookie } from "../util/UserUtil";
import fetch from 'isomorphic-unfetch';

const ALL_URL= "/meta/all";

let AppStore = {
    getAllData(req) {
        return  FetchData(req, ALL_URL);
    }
}

async function FetchData(req, path, parameters){
    let parameterStr = getCookie((req ? req.headers["cookie"] : document.cookie),"parameter");
        if (parameterStr) {
            let parameter = decryptParameter(parameterStr);
            let url = parameter[0] + path;
            const res = await fetch(url, {
                'method': 'POST',
                'mode': 'cors',
                'headers': {
                    'x-access-token':parameter[1]
                },
                'body': {}
            })
            const json = await res.json()
            return { json }
        } else {
            const json = { data: [] };
            return { json }
        }
}

export default AppStore;