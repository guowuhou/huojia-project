/**查询**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');

class conditionOper extends uu.Component {
    properties() {
        return {
            managerList: {
                defaultValue: null,
                type: uu.Node
            },
        };
    }
    onLoad() {
        this.bindEvent();
    }
    //绑定事件（搜索）
    bindEvent() {
        let self = this;
        $(this.node.dom).on('click', '#btn_search', function() {
            self.searchList(true);
        })
    } 
    //查询
    searchList(searchflag) {
        let filter = $('#manage').find('[filter]');
        let requireoptions = {};
         
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
             requireoptions[$(element).attr('filter')] = $(element).val() || '';
        }
        if (searchflag === true) {//是否在获取到筛选条件后直接查询
            this.managerList.getComponent('manager-list.es6').getproshelflist(requireoptions); 
        } else {
            return requireoptions;//单纯只获取筛选条件
        }
    }
};
module.exports = conditionOper;