/**上架状态**/
const $ = require('lib/jquery.js');
const utils=require('utils');

class getonStateData extends uu.Component{
    onLoad(){
        this.onStateData();
    }
    onStateData(){
        this._data = [
            {key:'ON_SALE',name:'上架中'},
            {key:'WAIT_SALE',name:'待上架'},
            {key:'OFF_SALE',name:'已下架'}
        ];
        this.getonStateList();
    }
    //构建 '上架状态' 下拉列表
    getonStateList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.name}</option>`);
            }
        }
        this.showOnStateDate();
    }
   showOnStateDate(){
        if(utils.url.get()['backPage']=='1'){
           var onStateDate=window.localStorage.getItem('saleStatus');
           $("#onState").val(onStateDate) 
        }
    }
};
module.exports = getonStateData;