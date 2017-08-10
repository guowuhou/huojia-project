/**产品期限**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class prdDeadline extends uu.Component{
    onLoad(){
        this. prdDeadlineData();
    }
    prdDeadlineData(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"65"},(res, event)=>{
                this._data = res.data||[];
                this.prdDeadlineList();
        });
    }
    //构建 '产品期限' 下拉列表
    prdDeadlineList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        };
        this.showDeadline();
    }
   showDeadline(){
        if(utils.url.get()['backPage']=='1'){
           var deadLineDate=window.localStorage.getItem('saveDeadline');
           $("#prdDeadline").val(deadLineDate) 
        }
    }
};
module.exports = prdDeadline;