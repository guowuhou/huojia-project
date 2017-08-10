/**销售渠道**/
const $ = require('lib/jquery.js');
const _ = require('lib/underscore.js');
require('lib/bootstrap-table.js');
require('lib/bootstrap-magicsuggest.js');
const utils = require('utils');


class shelvesChannel extends uu.Component {
    onLoad() {
        this.getshelvesData();
    }
    getshelvesData() {
        this._data = [
            // {id:'',name:'全部'},
            { id: 'C0001', name: '营业柜台' },
            { id: 'C0002', name: '网上银行' },
            { id: 'C0003', name: '手机银行' },
            { id: 'C0004', name: '爱客' },
            { id: 'C0005', name: '橙E网' },
            { id: 'C9999', name: '其它' }
        ];
        this.createShelvesList();
    }
    //构建 '上架渠道' 下拉列表
    createShelvesList() {
        let self = this;
        if (self._data.length > 0) {
            let accessChannel = [], channelList = [];
            for (let index = 0; index < this._data.length; index++) {
                let element = this._data[index];
                accessChannel.push(element.name);
            }
            accessChannel.unshift('全部')
            self.ms = $("#shelfUpStaus").magicSuggest({
                data: this._data,
                resultAsString: true,
                placeholder: "全部"
            });
        }
    }
    getShelvesValues() {
        const list = this.ms.getSelection();
        const ret = utils.array.pick(list, 'id');
        return ret.length ? ret.join(',') : '';
    }
};
module.exports = shelvesChannel;