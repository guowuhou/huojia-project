/**产品状态**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class prdStaus extends uu.Component{
    onLoad(){
        this.getprdStaus();
    }
    getprdStaus(){
         utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"75"},(res, event)=>{
                this._data = res.data||[];
                this.createStausList();
        });
    }
    //构建 '产品状态' 下拉列表
    createStausList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
        this.showPrdStatus();
    }
    showPrdStatus(){
        if(utils.url.get()['backPage']=='1'){
            var PrdStatusData=window.localStorage.getItem('productStatus');
            $("#productStatus").val(PrdStatusData)
        }
    }
};
module.exports = prdStaus;