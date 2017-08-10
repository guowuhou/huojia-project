/**接入渠道**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class getchannelData extends uu.Component{
    onLoad(){
        this.getChannelDate();
    }
    getChannelDate(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"36"},(res, event)=>{
                this._data = res.data||[];
                this.getChannelList();
        });
    }
    //构建 '接入渠道' 下拉列表
    getChannelList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
        this.showChannelDate();
    }
   showChannelDate(){
        if(utils.url.get()['backPage']=='1'){
           var salesChannelDate=window.localStorage.getItem('salesChannels');
           $("#channel").val(salesChannelDate) 
        }
    }
};
module.exports = getchannelData;