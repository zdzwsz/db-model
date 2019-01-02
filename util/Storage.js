class Storage{
    static localStorage(){
        if(typeof(window) === "object"){
            return window.localStorage;
        }else{
            return new Mask();
        }
    }

    static sessionStorage(){
        if(typeof(window) === "object"){
            return window.sessionStorage;
        }else{
            return new Mask();
        }
    }
}

class Mask{
    getItem(key){
        return null;
    }
}

module.exports = Storage;