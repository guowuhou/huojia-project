/**币种**/
const $ = require('lib/jquery.js');
const utils=require('utils');

class Currency extends uu.Component{
    onLoad(){
        this.getCurrency();
    }
    getCurrency(){
        this._data = [
            {key:'01',name:'RMB'},
            {key:'02',name:'HKD'},
            {key:'03',name:'USD'},  
        ];
        this.createCurrencyList();
    }
    //构建 '币种' 下拉列表
    createCurrencyList(){
        $(this.node.dom).innerHTML='';
        if(this._data.length>0){
            for (let index = 0; index < this._data.length; index++) {
                let element =this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.name}</option>`);
            }
        }
        this.showHistoryData();
    }
     //页面的返现
    showHistoryData(){
        if(utils.url.get()['backPage']=='1'){
           var currencyData=window.localStorage.getItem('currencyOptionVal');
           $("#Currencies").val(currencyData) 
        }
    }
};
module.exports = Currency;