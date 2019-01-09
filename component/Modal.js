export default class Modal {
    constructor(view) {
        this.view = view
        this.close = this.close.bind(this);
        this.config={open:false,title:"",message:"",type:"",close:this.close}
        this.view.state.modalConfig = this.config;
    }

    static createModal(view) {
        return new Modal(view)
    }

    alert(message){
        this.view.setState({modalConfig:{open:true,title:"警告",message:message,type:"alert"}});
    }

    close(){
        this.view.state.modalConfig.open=false;
    }

    confirm(message){
        let _this = this;
        const promise = new Promise((resolve, reject) => {
            _this.view.setState({modalConfig:{open:true,onOk:resolve,onCanel:reject,title:"确认",message:message,type:"confirm"}});
        })

        return new Agent(promise);
    }

    getConfig(){
        return this.view.state.modalConfig;
    }
}

class Agent{
    constructor(promise){
        this.promise =promise;
    }

    then(ok,canel){
        if(typeof(canel)=="undefined"){
            canel = function(){}
        }
       return this.promise.then(ok,canel);
    }
}