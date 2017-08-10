/**操作查询条件**/
const $ = require('lib/jquery.js');
const Dialog = require('plugins/dialog.es6');
const httpreq = require('httpreq.es6');

class conditionOper extends uu.Component {

    properties() {
        return {
            proshelflist: {
                defaultValue: null,
                type: uu.Node
            }
        };
    }

    onLoad() {
        this.bindEvents();
    }
    //绑定事件（清空条件、搜索）
    bindEvents() {
        let self = this;
        $(this.node.dom).on('click', '#cleanIterm', function () {
            self.clearItem();
        }).on('click', '#search', function () {
            self.searchFun(true);
        });
    } 
    //清空条件
    clearItem() {
        let formAll = $('#bank_deposit').find("form.form-inline");
        for (let index = 0; index < formAll.length; index++) {
            let itemform = formAll[index];
            itemform.reset();
            $(itemform).find("[filter=productSeries]").attr('proSeried','');
            $(itemform).find("[filter=prdCode]").attr('real-value','');
            $(itemform).find("[filter=prdTag]").attr('proLabelList','');
        };  
    }
    //搜索
    searchFun(searchflag) {
        let filter = $('#bank_deposit').find('[filter]');
        let requireoptions = { pageNo: 1 };
        for (let i = 0; i < filter.length; i++) {
            var element = filter[i];
            if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdCode'){
                requireoptions[$(element).attr('filter')] = $(element).attr('real-value') || $(element).val();
            }else if(element.nodeName.toLowerCase()==='select'&& $(element).attr('filter')==='ccy'){//币种
                if($("#ccy option:selected").text()=="全部"){
                     requireoptions[$(element).attr('filter')] ="";
                }else{
                     requireoptions[$(element).attr('filter')] = $("#ccy option:selected").text()||'';
                } 
            }else if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='productSeries'){//产品系列
                 requireoptions[$(element).attr('filter')] =$(element).attr('proSeried')||'';
            }else if(element.nodeName.toLowerCase()==='input'&& $(element).attr('filter')==='prdTag'){//产品标签
                requireoptions[$(element).attr('filter')] =$(element).attr('prolabellist')||'';
            }else{
                 requireoptions[$(element).attr('filter')] = $(element).val() || '';
            }   
        }
        var fixedClown = {};
        fixedClown['prdCode'] = $("#prdCode").val();
        fixedClown['ccy'] = $("#ccy").val();
        fixedClown['prdTag'] = $("#proLabel").val();
        fixedClown['saleStatus'] = $("#saleStatus").val();
        localStorage.setItem('fixedClown',JSON.stringify(fixedClown));
        if (searchflag === true) {//是否在获取到筛选条件后直接查询
            this.proshelflist.getComponent('bank_deposit_list.es6').getproshelflist(requireoptions); 
        } else {
            return requireoptions;//单纯只获取筛选条件
        }
    }
};
module.exports = conditionOper;