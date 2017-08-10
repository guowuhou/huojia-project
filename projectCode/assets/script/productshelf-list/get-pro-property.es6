/**产品属性**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils=require('utils');

class ProPropertyClass extends uu.Component {

    onLoad() {
        this.getProPropertyListData();
    }

    //获取 '产品属性' 数据
    getProPropertyListData() {
        utils.xhr.post(httpreq.PS_GetDictionaryType,{ddType:"15"},(res, event) => {
                this._data = _.sortBy(res.data || [], (item) => {
                    return item.proArr;
                });
                this.createProProperty();
        });
    }

    //构建 '产品属性' 下拉列表
    createProProperty() {
        $(this.node.dom).innerHTML = '';
        if (this._data.length > 0) {
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                $(this.node.dom).append(`<option value=${element.ddCode}>${element.ddName}</option>`);
            }
        }
        this.showProProperty();
    }
   showProProperty(){
        if(utils.url.get()['backPage']=='1'){
            var PrdPropertyData=window.localStorage.getItem('prdArr');
            $("#proProperty").val(PrdPropertyData)
        }
    }
};

module.exports = ProPropertyClass;