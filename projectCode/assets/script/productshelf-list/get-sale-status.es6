//信息完整saleStatus
const $ = require('lib/jquery.js');
const httpreq = require('httpreq.es6');

class SaleStatusClass extends uu.Component {

    onLoad() {
        this.getSaleStatusListData();
    }

    getSaleStatusListData() {
        this._data = [{ key: '1', value: '完整' }, { key: '0', value: '非完整' }];
        this.createSaleStatus();
    }

    //构建 '信息完整状态' 下拉列表
    createSaleStatus() {
        $(this.node.dom).innerHTML = '';
        if (this._data.length > 0) {
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.value}</option>`);
            }
        }
    }

};

module.exports = SaleStatusClass;