/**操作查询条件**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');
const utils = require('utils');

class operationCondition extends uu.Component {

    properties() {
        return {
            myApplylist: {
                defaultValue: null,
                type: uu.Node
            }
        };
    }

    onLoad() {
        this.bindEvents();
    }
    //绑定事件（清空条件、搜索、批量导出）
    bindEvents() {
        let self = this;
        $(this.node.dom).on('click', '#cleanterm', function () {
            self.clearConditionItem();
        }).on('click', '#btn_bankSearch', function () {
            self.searchFun(true);
        })
    } 
    //清空条件
    clearConditionItem() {
        let formAll = $('#checkStaus').find("select");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            $(itemform).val("ALL");
        };
        $("#productCode").val("");
    }
    //搜索
    searchFun(searchflag) {
        let filter = $('#checkStaus').find('[filter]');
        let requireoptions = { pageSize: 20,pageNo: 1 };
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            requireoptions[$(element).attr('filter')] =  $(element).val();
         }
       if (searchflag === true) {//是否在获取到筛选条件后直接查询
            this.myApplylist.getComponent('checkList.es6').getproshelflist(requireoptions); 
        } else {
            return requireoptions;//单纯只获取筛选条件
        }
    }
};
module.exports= operationCondition;