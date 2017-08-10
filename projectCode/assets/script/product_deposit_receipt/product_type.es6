/** 存款类型**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class productType extends uu.Component{
    onLoad(){
        this.getprdTypeDate();
    }
    getprdTypeDate(){
         utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"55"},(res, event)=>{
                this._data = res.data||[];
                this.getprdTypeList();
        });
    }
    //构建 ' 存款类型' 下拉列表
    getprdTypeList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        };
        this.showDespoit();
    }
    showDespoit(){
        if(utils.url.get()['backPage']=='1'){
           var despoitType=window.localStorage.getItem('productType');
           $("#prdType").val(despoitType) 
        }
    }
};
module.exports = productType;