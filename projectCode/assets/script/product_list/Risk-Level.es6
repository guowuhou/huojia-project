/**风险等级**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class riskLevel extends uu.Component{
   onLoad() {
        this.getriskLevelDate();
    }
    //获取 '风险等级' 数据
    getriskLevelDate(){
       utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"40"},(res, event)=>{
                this._data = res.data||[];
                this.getriskLevelList();
        });
    }
    //构建 '风险等级' 下拉列表
    getriskLevelList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
        this.showLevelList();
    }
    showLevelList(){
        if(utils.url.get()['backPage']=='1'){
             var riskLevelData=window.localStorage.getItem('riskLevel');
            $("#riskLevel").val(riskLevelData)
        }
    }
};
module.exports = riskLevel;