/**上架状态**/
const $ = require('lib/jquery.js');
const utils=require('utils');

class putawayStaus extends uu.Component{
    onLoad(){
        this.salesStausList();
    }
    salesStausList(){
        this._data = [
            {key:'INIT',name:'初始'},
            {key:'NEW_SALE',name:'新产品上架'},
            {key:'WAIT_SALE',name:'待上架'},
            {key:'ON_SALE',name:'上架中'},
            {key:'OFF_SALE',name:'已下架'},
            {key:'FAIL_SALE',name:'上架失败'},
        ];
        this.putawayStausList();
    }
    //构建 '信息完整' 下拉列表
    putawayStausList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.name}</option>`);
            }
        };
        this.showPutawayStaus();
    }
   showPutawayStaus() {
        if (utils.url.get()['backPage'] == '1') {
            var putawayStausData = window.localStorage.getItem('saleStatus');
            $("#putawayStatus").val(putawayStausData)
        }
    }
};
module.exports = putawayStaus;