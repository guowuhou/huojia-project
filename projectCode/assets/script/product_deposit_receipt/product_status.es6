/**产品状态**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class prdStatusData extends uu.Component{
    onLoad(){
        this.getPrdStatusData();
    }
    getPrdStatusData(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"56"},(res, event)=>{
                this._data = res.data||[];
                this.getPrdStatusList();
        });
    }
    //构建 '产品状态' 下拉列表
    getPrdStatusList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
    }
};
module.exports = prdStatusData;