/**产品类型**/
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class ProTypeClass extends uu.Component {

    onLoad() {
        this.getProTypeListData();
    }

    getProTypeListData() {
        this._data = [{ key: '0', value: '公募' }, { key: '1', value: '资管' }];
        this.createProType();
    }

    //构建 '产品类型' 下拉列表
    createProType() {
        $(this.node.dom).innerHTML = '';
        if (this._data.length > 0) {
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.value}</option>`);
            }
        }
       this.showProductType(); 
    }
    showProductType(){
        if(utils.url.get()['backPage']=='1'){
            var PrdTypeData=window.localStorage.getItem('prdType');
            $("#proType").val(PrdTypeData)
        }
    }
};

module.exports = ProTypeClass;