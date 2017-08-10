/**客户资产配置分类**/
const $ = require('lib/jquery.js');
const utils=require('utils');

class AssetAllocationClass extends uu.Component {

    onLoad() {
        this.getAssetAllocationListData();
    }

    getAssetAllocationListData() {
        this._data = [
            { key: 'A0005', name: '不区分' },
            { key: 'A0001', name: '现金类' },
            { key: 'A0002', name: '固收类' },
            { key: 'A0003', name: '权益类' },
            { key: 'A0004', name: '另类投资' }
        ];
        this.createAssetAllocation();
    }

    //构建 '客户资产配置分类' 下拉列表
    createAssetAllocation() {
        $(this.node.dom).innerHTML = '';
        if (this._data.length > 0) {
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                $(this.node.dom).append(`<option value=${element.key}>${element.name}</option>`);
            }
        };
        this.showAssetAllocation();
    }
    showAssetAllocation() {
        if (utils.url.get()['backPage'] == '1') {
            var allocationData = window.localStorage.getItem('cusAssetClass');
            $("#assetAllocation").val(allocationData)
        }
    }
};

module.exports = AssetAllocationClass;