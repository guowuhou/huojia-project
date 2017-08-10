/**滚动模式**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const Dialog = require('plugins/dialog.es6');
const utils=require('utils');

class scrollModel extends uu.Component{
    onLoad(){
        this.getscrollModeListData();
    }
    getscrollModeListData(){
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"21"},(res, event)=>{
                this._data = res.data||[];
                this.createScrollModeList();
        });
    }
    //构建 '滚动模式' 下拉列表
    createScrollModeList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddCode}-${element.ddName}</option>`);
            }
        }
        this.showback();
    }
    showback(){
        if(utils.url.get()['backPage']=='1'){
            var cycleModeData=window.localStorage.getItem('cycleMode');
            $("#scrollModel").val(cycleModeData)
        }
    }
};
module.exports = scrollModel;