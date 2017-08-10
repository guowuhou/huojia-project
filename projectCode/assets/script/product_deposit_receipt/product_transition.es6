/**转让类型**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class transitionData extends uu.Component{
    onLoad(){
        this.getTransitionDate();
    }
    getTransitionDate(){
         utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"57"},(res, event)=>{
                this._data = res.data||[];
                this. getTransitionList();
        });
    }
    //构建 '转让类型' 下拉列表
    getTransitionList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
        this.showTransitionDate();
    }
   showTransitionDate(){
        if(utils.url.get()['backPage']=='1'){
           var transitionDate=window.localStorage.getItem('resellType');
           $("#prdTransition").val(transitionDate) 
        }
    }
};
module.exports = transitionData;